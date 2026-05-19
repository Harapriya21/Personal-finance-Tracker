const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");


// GET ALL EXPENSES

router.get("/", async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});


// ADD EXPENSE

router.post("/", async (req, res) => {
  const newExpense = new Expense(req.body);

  const savedExpense = await newExpense.save();

  res.json(savedExpense);
});


// UPDATE EXPENSE

router.put("/:id", async (req, res) => {
  const updatedExpense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedExpense);
});


// DELETE EXPENSE

router.delete("/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);

  res.json({
    message: "Expense Deleted",
  });
});

module.exports = router;