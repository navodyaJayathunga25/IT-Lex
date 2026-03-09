import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, 'Question is required'],
        trim: true
    },

    answer: {
        type: String,
        required: [true, 'Answer is required'],
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

const FAQ = mongoose.model('FAQs', faqSchema);

export default FAQ;
