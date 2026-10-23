const Application = require("../models/Application");
const Company = require("../models/Company");

const allowedStatuses = [
  "WISHLIST",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

exports.getFollowUps = async (req, res) => {
  try {
    const now = new Date();

    const applications = await Application.find({
      user: req.user.id,
      followUpDate: { $ne: null },
    })
      .sort({ followUpDate: 1 })
      .populate("company", "name")
      .select("role status priority followUpDate nextAction company");

    const overdue = [];
    const upcoming = [];

    for (const application of applications) {
      if (application.followUpDate < now) {
        overdue.push(application);
      } else {
        upcoming.push(application);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        overdue,
        upcoming,
        total: applications.length,
      },
    });
  } catch (error) {
    console.error("Follow-ups error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve follow-ups.",
    });
  }
};

exports.createApplication = async (req, res) => {
  try {
    const {
      role,
      company,
      location,
      jobType,
      workMode,
      salary,
      currency,
      jobUrl,
      source,
      status,
      appliedAt,
      notes,
    } = req.body;

    if (typeof role !== "string" || !role.trim() || !company) {
      return res.status(400).json({
        success: false,
        message: "Role and company are required",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const companyExists = await Company.findOne({
      _id: company,
      user: req.user.id,
    });

    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const application = await Application.create({
      role: role.trim(),
      company,
      user: req.user.id,
      location,
      jobType,
      workMode,
      salary,
      currency,
      jobUrl,
      source,
      status,
      appliedAt,
      notes,
    });

    await application.populate("company", "name website");

    return res.status(201).json({
      success: true,
      message: "Application created successfully",
      application,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID or field value",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create application",
    });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const {
      status,
      company,
      location,
      jobType,
      workMode,
      search,
      sortBy = "appliedAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const currentPage = Number(page);
    const pageSize = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      currentPage < 1 ||
      !Number.isInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100",
      });
    }

    const filter = { user: req.user.id };

    if (status) filter.status = status;
    if (jobType) filter.jobType = jobType;
    if (workMode) filter.workMode = workMode;

    if (company) {
      const companyExists = await Company.exists({
        _id: company,
        user: req.user.id,
      });

      if (!companyExists) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      filter.company = company;
    }

    if (location) {
      filter.location = { $regex: escapeRegex(location), $options: "i" };
    }

    if (search) {
      filter.role = { $regex: escapeRegex(search), $options: "i" };
    }

    const sortableFields = ["appliedAt", "createdAt", "updatedAt", "role"];
    const field = sortableFields.includes(sortBy) ? sortBy : "appliedAt";
    const direction = order === "asc" ? 1 : -1;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate("company", "name website")
        .sort({ [field]: direction })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Application.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: applications.length,
      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        pages: Math.ceil(total / pageSize),
      },
      applications,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID or query parameter",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve applications",
    });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("company", "name website industry location");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve application",
    });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const allowedFields = [
      "role",
      "company",
      "location",
      "jobType",
      "workMode",
      "salary",
      "currency",
      "jobUrl",
      "source",
      "appliedAt",
      "notes",
      "priority",
      "followUpDate",
      "nextAction",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (req.body.status !== undefined) {
      return res.status(400).json({
        success: false,
        message: "Use the status endpoint to change application status",
      });
    }

    if (
      updates.role !== undefined &&
      (typeof updates.role !== "string" || !updates.role.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Role cannot be empty",
      });
    }

    if (updates.role) updates.role = updates.role.trim();

    if (updates.company) {
      const companyExists = await Company.exists({
        _id: updates.company,
        user: req.user.id,
      });

      if (!companyExists) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }
    }

    if (
      req.body.priority !== undefined &&
      !["LOW", "MEDIUM", "HIGH"].includes(req.body.priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Priority must be LOW, MEDIUM, or HIGH.",
      });
    }

    if (req.body.followUpDate !== undefined) {
      const value = req.body.followUpDate;

      if (value !== null && value !== "") {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid follow-up date.",
          });
        }

        req.body.followUpDate = date;
      } else {
        req.body.followUpDate = null;
      }
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("company", "name website");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID or field value",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update application",
    });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "A valid application status is required",
      });
    }

    if (
      note !== undefined &&
      (typeof note !== "string" || note.length > 1000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Note must be a string of at most 1000 characters",
      });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.status === status) {
      return res.status(200).json({
        success: true,
        message: "Application already has this status",
        application,
      });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      note,
    });

    await application.save();
    await application.populate("company", "name website");

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};

exports.getApplicationHistory = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).select("status statusHistory");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      currentStatus: application.status,
      history: application.statusHistory,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve application history",
    });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete application",
    });
  }
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
