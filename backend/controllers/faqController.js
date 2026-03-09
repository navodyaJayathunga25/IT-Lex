import FAQ from "../models/faqs.js";

// Helper: Check if user is the admin 
const isAdmin = (user) => {
  return user && (user.role === "admin");
};

// Create FAQ — only admin 
export async function createFAQ(req, res) {
  try {
    const { question, answer } = req.body;

    // Validation
    if (!question || question.trim().length <= 10) {
      return res.status(400).json({
        success: false,
        message: "Question must be more than 10 characters long.",
      });
    }
    if (!answer || answer.trim().length <= 10) {
      return res.status(400).json({
        success: false,
        message: "Answer must be more than 10 characters long.",
      });
    }

    const faq = new FAQ({
      question: question.trim(),
      answer: answer.trim(),
    });
    await faq.save();

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      faq,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
// Get all FAQs — public
export async function getFAQs(req, res) {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { question: { $regex: search, $options: "i" } },
          { answer: { $regex: search, $options: "i" } },
        ],
      };
    }

    const faqList = await FAQ.find(query);
    res.json({
      success: true,
      data: faqList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Search FAQs — public (optional, can be removed if redundant)
export async function searchFAQs(req, res) {
  try {
    const { search } = req.query;
    if (!search || typeof search !== "string" || search.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }

    const query = {
      $or: [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ],
    };

    const faqList = await FAQ.find(query);
    res.json({ success: true, data: faqList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get FAQ by ID — public
export async function getFAQById(req, res) {
  try {
    const faq = await FAQ.findById(req.params.faqId);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Update FAQ — only admin r agriOfficer
export async function updateFAQ(req, res) {
  try {
    if (!req.user || !isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can update FAQs.",
      });
    }

    const { question, answer } = req.body;
    if (question !== undefined && (question.trim().length <= 10 || !question.trim())) {
      return res.status(400).json({
        success: false,
        message: "Question must be more than 10 characters long.",
      });
    }
    if (answer !== undefined && (answer.trim().length <= 10 || !answer.trim())) {
      return res.status(400).json({
        success: false,
        message: "Answer must be more than 10 characters long.",
      });
    }

    const faq = await FAQ.findByIdAndUpdate(
      req.params.faqId,
      { 
        ...(question && { question: question.trim() }),
        ...(answer && { answer: answer.trim() })
      },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({
      success: true,
      message: "FAQ updated successfully",
      faq,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete FAQ — only admin 
export async function deleteFAQ(req, res) {
  try {
    if (!req.user || !isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete FAQs.",
      });
    }

    const faq = await FAQ.findByIdAndDelete(req.params.faqId);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}