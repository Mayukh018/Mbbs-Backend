import Contact from "../models/contactModel.js";

export const handleContactForm = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, subject, message } = req.body;
  
    if (!firstName || !lastName || !email || !phoneNumber || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
  
    try {
      const contact = new Contact({
        firstName,
        lastName,
        email,
        phoneNumber,
        subject,
        message
      });
  
      await contact.save();
  
      res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };