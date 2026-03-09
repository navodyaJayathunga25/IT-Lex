import express from "express"
import {createFAQ, getFAQs, getFAQById, updateFAQ, deleteFAQ, searchFAQs, } from "../controllers/faqController.js"


const faqRouter = express.Router();

faqRouter.post("/", createFAQ);
faqRouter.get("/", getFAQs);
faqRouter.get("/:faqId", getFAQById);
faqRouter.get("/search/faqs", searchFAQs);
faqRouter.put("/:faqId",   updateFAQ);
faqRouter.delete("/:faqId",  deleteFAQ);

export default faqRouter;







