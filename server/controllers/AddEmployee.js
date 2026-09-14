const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AddEmployeeModel = require('../models/AddEmployee');
const protect = require('../middleware/AuthMiddleware');

const ALLOWED_POSITIONS = ['Chef', 'Waiter', 'Manager'];
const ALLOWED_FIELDS = ['EmployeeName', 'EmployeeEmail', 'EmployeeAge', 'EmployeePosition', 'Salary', 'Contact', 'password'];
const SAFE_EMPLOYEE_FIELDS = '-password';

function pickEmployeeFields(body) {
    const picked = {};
    for (const field of ALLOWED_FIELDS) {
        if (body[field] !== undefined) {
            picked[field] = body[field];
        }
    }
    return picked;
}

function toSafeEmployee(employee) {
    if (!employee) return employee;
    const safe = employee.toObject ? employee.toObject() : { ...employee };
    delete safe.password;
    return safe;
}

async function findCallerEmployee(req) {
    if (!req.user?.email) return null;
    return AddEmployeeModel.findOne({ EmployeeEmail: req.user.email })
        .select('EmployeeEmail EmployeePosition')
        .lean();
}

async function requireManager(req, res, next) {
    try {
        const caller = await findCallerEmployee(req);
        if (!caller || caller.EmployeePosition !== 'Manager') {
            return res.status(403).json({ message: 'Manager access is required' });
        }
        req.callerEmployee = caller;
        return next();
    } catch (error) {
        return res.status(500).json({ message: 'Failed to authorize employee action' });
    }
}

async function requireSelfOrManager(req, res, next) {
    try {
        const employeeId = req.params.userId || req.params.id;
        const employee = await AddEmployeeModel.findById(employeeId).select('EmployeeEmail EmployeePosition');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const caller = await findCallerEmployee(req);
        const isManager = caller?.EmployeePosition === 'Manager';
        const isSelf = caller?.EmployeeEmail && caller.EmployeeEmail === employee.EmployeeEmail;

        if (!isManager && !isSelf) {
            return res.status(403).json({ message: 'You are not allowed to access this employee' });
        }

        req.callerEmployee = caller;
        req.targetEmployee = employee;
        return next();
    } catch (error) {
        return res.status(500).json({ message: 'Failed to authorize employee action' });
    }
}

router.post('/addemployee', protect, requireManager, async (req, res) => {
    try {
        const payload = pickEmployeeFields(req.body);

        if (payload.EmployeePosition && !ALLOWED_POSITIONS.includes(payload.EmployeePosition)) {
            return res.status(400).json({ message: 'Invalid employee position' });
        }

        const savedEmployee = await new AddEmployeeModel(payload).save();
        res.status(201).json(toSafeEmployee(savedEmployee));
    } catch (error) {
        res.status(500).json({ message: 'Error adding employee', error: error.message });
    }
});

router.get('/employees', protect, requireManager, async (req, res) => {
    try {
        const employees = await AddEmployeeModel.find().select(SAFE_EMPLOYEE_FIELDS);
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error });
    }
});

router.get('/employee/:userId', protect, requireSelfOrManager, async (req, res) => {
    try {
        const employee = await AddEmployeeModel.findById(req.params.userId).select(SAFE_EMPLOYEE_FIELDS);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error });
    }
});

router.put('/employee/:id', protect, requireManager, async (req, res) => {
    try {
        const update = pickEmployeeFields(req.body);

        if (update.EmployeePosition && !ALLOWED_POSITIONS.includes(update.EmployeePosition)) {
            return res.status(400).json({ message: 'Invalid employee position' });
        }

        if (update.password && !(update.password.startsWith('$2a$') || update.password.startsWith('$2b$'))) {
            const saltRounds = Number(process.env.SALT) || 10;
            update.password = await bcrypt.hash(update.password, saltRounds);
        }

        const updatedEmployee = await AddEmployeeModel.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        );

        if (updatedEmployee) {
            res.status(200).json(toSafeEmployee(updatedEmployee));
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
});

router.delete('/employee/:id', protect, requireManager, async (req, res) => {
    try {
        const deletedEmployee = await AddEmployeeModel.findByIdAndDelete(req.params.id);
        if (deletedEmployee) {
            res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
});

module.exports = router;
