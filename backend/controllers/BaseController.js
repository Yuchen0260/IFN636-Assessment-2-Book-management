// OOP – Abstraction & Encapsulation:
// BaseController encapsulates shared response helpers so every controller
// inherits consistent error handling without duplicating code.
class BaseController {
    // Encapsulated error handler — subclasses may override (Polymorphism)
    handleError(res, error) {
        return res.status(500).json({ message: error.message });
    }

    notFound(res, resource = 'Resource') {
        return res.status(404).json({ message: `${resource} not found` });
    }

    badRequest(res, message) {
        return res.status(400).json({ message });
    }
}

module.exports = BaseController;
