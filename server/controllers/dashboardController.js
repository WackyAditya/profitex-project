const Invoice = require("../models/Invoice");
const Expense = require("../models/Expense");
const Product = require("../models/Product");
const Purchase = require("../models/Purchase");

exports.getDashboardData = async (req, res) => {
  try {

    const invoices = await Invoice.find({ user: req.user._id });
    const expenses = await Expense.find({ user: req.user._id });
    const purchases = await Purchase.find({ user: req.user._id });

    /* ===== TOTALS ===== */

    const totalSales = invoices.reduce(
      (sum, inv) => sum + inv.grandTotal,
      0
    );

    const totalExpenses = expenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    const totalPurchaseCost = purchases.reduce(
      (sum, pur) => sum + pur.totalCost,
      0
    );

    const totalProducts = await Product.countDocuments({
      user: req.user._id
    });

    /* ===== 12 MONTH SALES STRUCTURE ===== */

    const monthlySales = {};

    // initialize all 12 months
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(0, i)
        .toLocaleString("default", { month: "short" });
      monthlySales[monthName] = 0;
    }

    // fill actual invoice data
    invoices.forEach(inv => {
      const month = new Date(inv.createdAt)
        .toLocaleString("default", { month: "short" });
      monthlySales[month] += inv.grandTotal;
    });

    /* ===== EXPENSE CATEGORY ===== */

    const expenseCategories = {};

    expenses.forEach(exp => {
      expenseCategories[exp.category] =
        (expenseCategories[exp.category] || 0) + exp.amount;
    });

    res.json({
      totalSales,
      totalExpenses,
      totalPurchaseCost,
      totalProducts,
      profit: totalSales - totalExpenses - totalPurchaseCost,
      monthlySales,
      expenseCategories
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
};
