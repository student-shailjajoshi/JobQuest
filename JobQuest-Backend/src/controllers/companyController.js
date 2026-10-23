const Company = require("../models/Company");
const Application = require("../models/Application");

exports.createCompany = async (req, res) => {
  try {
    const { name, website, industry, location, notes } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const company = await Company.create({
      name: name.trim(),
      website,
      industry,
      location,
      notes,
      user: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already added this company",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create company",
    });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

    const filter = { user: req.user.id };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .sort({ name: 1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Company.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: companies.length,
      pagination: {
        total,
        page: currentPage,
        pages: Math.ceil(total / pageSize),
      },
      companies,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve companies",
    });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve company",
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "website",
      "industry",
      "location",
      "notes",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.name !== undefined &&
      (typeof updates.name !== "string" || !updates.name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Company name cannot be empty",
      });
    }

    if (updates.name) {
      updates.name = updates.name.trim();
    }

    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already added this company",
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update company",
    });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const hasApplications = await Application.exists({
      company: company._id,
      user: req.user.id,
    });

    if (hasApplications) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete a company linked to applications",
      });
    }

    await company.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete company",
    });
  }
};

exports.getCompanyApplications = async (req, res) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).select("_id");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const applications = await Application.find({
      company: company._id,
      user: req.user.id,
    })
      .sort({ appliedAt: -1 })
      .populate("company", "name website")
      .lean();

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve company applications",
    });
  }
};