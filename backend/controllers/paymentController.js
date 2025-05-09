import User from '../models/userModel.js';
import Payment from '../models/transactionModel.js';

const SERVICE_CONFIG = {
    Plan_A: {
        price: 0,
        unlocks: ['checkYourList','ChoiceFilling'] 
    },
    Plan_B: {
        price: 0,
        unlocks: ['premiumContent', 'collegePredictor','checkYourList','ChoiceFilling','callSenior']
    },
    Offline_Plan:{
        price: 0,
        unlocks: ['premiumContent', 'collegePredictor','checkYourList','ChoiceFilling','callSenior']
    },
    Freedom_Plan:{
        price: 0,
        unlocks: ['premiumContent', 'collegePredictor','checkYourList','ChoiceFilling','callSenior']
    },
    Online_Plan_A:{
        price: 0,
        unlocks: ['premiumContent', 'collegePredictor','checkYourList','ChoiceFilling','callSenior']
    },
    premiumContent: {
        price: 0,
        unlocks: ['premiumContent']
    },
    collegePredictor: {
        price: 0,
        unlocks: ['collegePredictor']
    },
    callSenior: {
        price: 0,
        unlocks: ['callSenior']
    }
};

export const processPayment = async (req, res) => {
    const { serviceType } = req.body;
  
    try {
      const user = await User.findById(req.user._id);
  
      const config = SERVICE_CONFIG[serviceType];
      if (!config) return res.status(400).json({ error: "Invalid service" });
  
      if (user.plansBought.includes(serviceType)) {
        return res.status(400).json({ error: "You have already purchased this plan." });
      }
  
      const transactionId = `txn_${Math.random().toString(36).slice(2, 9)}`;
  
      const payment = await Payment.create({
        user: user._id,
        serviceType,
        amount: config.price,
        status: 'completed',
        transactionId
      });
  
      const update = {
        $push: {
          payments: payment._id,
          plansBought: serviceType // <-- Add plan to bought list
        },
        $set: {}
      };
  
      for (const service of config.unlocks) {
        update.$set[`services.${service}.isActive`] = true;
        update.$set[`services.${service}.unlockedVia`] = serviceType;
  
        if (service === 'collegePredictor') {
          update.$set['services.collegePredictor.searchesLeft'] = 0;
        }
      }
  
      await User.updateOne({ _id: user._id }, update);
  
      res.json({
        success: true,
        unlockedServices: config.unlocks,
        transactionId
      });
  
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ error: error.message });
    }
  };
  