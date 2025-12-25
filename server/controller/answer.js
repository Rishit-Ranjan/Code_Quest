import mongoose from "mongoose";
import question from "../models/question.js";
import user from "../models/auth.js";

export const Askanswer = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  const { noofanswer, answerbody, useranswered, userid } = req.body;
  updatenoofanswer(_id, noofanswer);

  try {
    const updatequestion = await question.findByIdAndUpdate(_id, {
      $addToSet: { answer: [{ answerbody, useranswered, userid }] },
    });
    // create notification for question owner
    try {
      const q = await question.findById(_id);
      if (q && q.userid && String(q.userid) !== String(userid)) {
        await user.findByIdAndUpdate(q.userid, {
          $push: {
            notifications: {
              type: "answer",
              message: `${useranswered} answered your question: ${q.questiontitle}`,
              link: `/questions/${q._id}`,
            },
          },
        });
      }
    } catch (err) {
      console.log("notify error", err);
    }
    res.status(200).json({ data: updatequestion });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};
const updatenoofanswer = async (_id, noofanswer) => {
  try {
    await question.findByIdAndUpdate(_id, { $set: { noofanswer: noofanswer } });
  } catch (error) {
    console.log(error);
  }
};
export const deleteanswer = async (req, res) => {
  const { id: _id } = req.params;
  const { noofanswer, answerid } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  if (!mongoose.Types.ObjectId.isValid(answerid)) {
    return res.status(400).json({ message: "answer unavailable" });
  }
  updatenoofanswer(_id, noofanswer);
  try {
    const updatequestion = await question.updateOne(
      { _id },
      {
        $pull: { answer: { _id: answerid } },
      }
    );
    res.status(200).json({ data: updatequestion });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};
