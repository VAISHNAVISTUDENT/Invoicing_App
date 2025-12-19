const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const Company = require("./models/company");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/accountingApp")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("The working site");
});

app.get("/company/setup", (req, res) => {
  res.render("company.ejs");
});

app.get("/dashboard/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch company from MongoDB
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).send("Company not found");
    }

    res.render("dashboard.ejs", { company });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


app.post("/company/setup", async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.redirect(`/dashboard/${company._id}`);
  } catch (err){
    console.error(err);
    res.status(400).send("Error saving company");
  }
});

// GET route to show edit form
app.get("/company/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).send("Company not found");
    }

    res.render("editCompany.ejs", { company });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// PUT/POST route to update company
app.post("/company/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!company) {
      return res.status(404).send("Company not found");
    }

    res.redirect(`/dashboard/${company._id}`);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error updating company");
  }
});

// DELETE route
app.post("/company/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return res.status(404).send("Company not found");
    }

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting company");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
