// Middleware to check if user is authenticated
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
export const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        if (!req) {
            throw new Error('Request object is undefined');
        }
        req.user = user;  
        req.userId = user._id;  
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ success: false, message: 'Please authenticate' });
    }
}

export const checkPredictorAccess = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      const usage = user.services?.collegePredictor;
  
      if (usage?.isActive) {
        return next();
      }
  
      if (typeof usage?.searchesLeft === 'number' && usage.searchesLeft > 0) {
        user.services.collegePredictor.searchesLeft -= 1;
        await user.save();
        return next();
      }
  
      return res.status(403).json({
        success: false,
        message: 'Free trials exhausted. Please purchase full access.',
        upgradeUrl: '/api/college/purchase',
        trialsRemaining: 0,
      });
  
    } catch (error) {
      console.error('Predictor Access Check Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
