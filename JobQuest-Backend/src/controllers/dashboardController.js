const mongoose = require("mongoose");
const Application = require("../models/Application");

const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const [
      totalApplications,
      statusDistribution,
      weeklyApplications,
      monthlyApplications,
      interviewCount,
      offerCount,
      companyStats,
      recentApplications,
    ] = await Promise.all([
      Application.countDocuments({ user: userId }),

      Application.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            status: "$_id",
            count: 1,
          },
        },
        { $sort: { status: 1 } },
      ]),

      Application.countDocuments({
        user: userId,
        appliedAt: { $gte: weekStart, $lte: now },
      }),

      Application.countDocuments({
        user: userId,
        appliedAt: { $gte: monthStart, $lte: now },
      }),

      Application.countDocuments({
        user: userId,
        statusHistory: {
          $elemMatch: {
            status: { $in: ["INTERVIEW", "OFFER"] },
          },
        },
      }),

      Application.countDocuments({
        user: userId,
        status: "OFFER",
      }),

      Application.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$company",
            applicationCount: { $sum: 1 },
            offers: {
              $sum: {
                $cond: [{ $eq: ["$status", "OFFER"] }, 1, 0],
              },
            },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "_id",
            foreignField: "_id",
            as: "company",
          },
        },
        { $unwind: "$company" },
        {
          $project: {
            _id: 0,
            companyId: "$company._id",
            companyName: "$company.name",
            applicationCount: 1,
            offers: 1,
          },
        },
        { $sort: { applicationCount: -1, companyName: 1 } },
        { $limit: 10 },
      ]),

      Application.find({ user: userId })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate("company", "name")
        .select("role status appliedAt updatedAt company"),
    ]);

    const submittedApplications = await Application.countDocuments({
      user: userId,
      status: { $ne: "WISHLIST" },
    });

    const interviewRate = submittedApplications
      ? Number(
          ((interviewCount / submittedApplications) * 100).toFixed(2)
        )
      : 0;

    const offerRate = submittedApplications
      ? Number(
          ((offerCount / submittedApplications) * 100).toFixed(2)
        )
      : 0;

    const distribution = Object.fromEntries(
      statusDistribution.map(({ status, count }) => [status, count])
    );

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalApplications,
          submittedApplications,
          wishlistCount: distribution.WISHLIST || 0,
          weeklyApplications,
          monthlyApplications,
          interviewCount,
          offerCount,
          interviewRate,
          offerRate,
        },
        statusDistribution: distribution,
        topCompanies: companyStats,
        recentApplications,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard analytics.",
    });
  }
};

module.exports = { getDashboard };