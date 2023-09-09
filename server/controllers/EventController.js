// importing the Schemas

const Event = require("../models/EventSchema");
const User = require("../models/UserSchema");

/**
 * createEvent() - Asynchronous Function
 *     - Destructures the input received in req.body.
 *    - Destructures the userid/appwriteId received in req.params.
 *   - Create a eventObj object.
 * - Validated if reminderMsg is received.
 * - Validated if reminderMsg received is of type string.
 * - define reminderMsg property in eventObj.
 * - Validated if reminderDate is received.
 * - Validated if reminderDate received is of type string.
 * - define reminderDate property in eventObj.
 *
 * - Validated if userId/appwriteId is received.
 * - Validated if userId/appwriteId received is of type string.
 * - Fetch the user in DB using appwriteId
 * - Validate user exists
 *
 * - After finding user add his user._id as property in eventObj.
 * - Creates a new event document from the validated data. (Asynchronous operation - create())
 * - Update user events using the event._id and save.
 */

exports.createEvent = async (req, res) => {
  try {
    const { reminderMsg, remindAt, userId } = req.body;
    const eventObj = {};

    if (!reminderMsg) {
      throw new Error("reminderMsg is required");
    }
    if (typeof reminderMsg !== "string") {
      throw new Error("reminderMsg should be of type string");
    }

    if (!remindAt) {
      throw new Error("remindAt is required");
    }
    if (typeof remindAt !== "string") {
      throw new Error("remindAt should be of type string");
    }

    Object.defineProperty(eventObj, "reminderMsg", {
      value: reminderMsg,
      enumerable: true,
    });

    Object.defineProperty(eventObj, "remindAt", {
      value: remindAt,
      enumerable: true,
    });

    if (!userId) {
      throw new Error(
        "userId required, Please pass userId to create a Reminder"
      );
    }
    if (typeof userId !== "string") {
      throw new Error("userId should be of type string");
    }

    Object.defineProperty(eventObj, "isReminded", {
      value: false,
      enumerable: true,
    });

    const user = await User.find({ appwriteId: userId });
    if (!user[0]) {
      throw new Error("User not found in DB");
    }

    Object.defineProperty(eventObj, "user", {
      value: user[0]._id,
      enumerable: true,
    });

    // const reminder = await Reminder.create({
    //   reminderMsg,
    //   remindAt,
    //   isReminded: false,
    // });

    const reminder = await Event.create(eventObj);

    if (!user[0].events) {
      user[0].events = [reminder._id];
    } else {
      user[0].events.push(reminder._id);
    }

    await user[0].save();

    res.status(200).json({
      success: true,
      message: "Reminder created successfully",
      data: reminder,
      user: user[0],
    });
  } catch (error) {
    console.log("Error in createEvent Controller");
    console.log("Error", error);
    res.status(500).json({
      success: false,
      message: "Error in createEvent Controller",
      errorMessage: error.message,
    });
  }
};

/**
 * getEvents() - Asynchronous Function  ***ADMIN ROUTE***
 *    - Fetches all the events from DB. (Asynchronous operation - find())
 *  - If no events found, throws an error.
 * - If events found, returns the events.
 *
 */

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({});

    if (!events) {
      throw new Error("No events found");
    }
    // console.log(events);
    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.log("Error in getEvents Controller");
    console.log("Error", error);
    res.status(500).json({
      success: false,
      message: "Error in getEvents Controller",
      errorMessage: error.message,
    });
  }

  // try {
  //     const reminders = await Reminder.find({});
  //     res.status(200).json({
  //       success: true,
  //       reminders,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Something went wrong",
  //       errorMessage: error.message,
  //     });
  //   }
};

/**
 * getEvent() - Asynchronous Function
 *   - Destructures the input received in req.params.
 * - Validated if eventId is received.
 * - Validated if eventId received is of type string.
 * - Fetches the event with respect to eventId in DB using eventId (Asynchronous operation - findById())
 * - validate if userId is revieved
 * - validate if userId is of type string
 * - Fetches the user with respect to userId/appwriteId in DB using userId (Asynchronous operation - findById())
 * - validate if user and event exist in DB
 * -
 * - validate the ownership of user and event
 * - If user is not the owner of event, throws an error.
 * - If user is the owner of event, returns the event.
 */

exports.getEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    if (!eventId) {
      throw new Error("eventId is required");
    }
    if (typeof eventId !== "string") {
      throw new Error("eventId should be of type string");
    }

    if (!userId) {
      throw new Error("userId is required");
    }
    if (typeof userId !== "string") {
      throw new Error("userId should be of type string");
    }

    const event = await Event.findById(eventId);
    const user = await User.find({ appwriteId: userId });

    if (!event) {
      throw new Error("Event not found in DB");
    }
    if (!user) {
      throw new Error("User not found in DB");
    }
    console.log("event : ", event);
    console.log("user : ", user);

    if (event.user.equals(user[0]._id) === false) {
      throw new Error("User is not the owner of the event");
    }
    res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      data: event,
    });

    // if (event.user.toString() !== user[0]._id.toString()) {
    //   throw new Error("User is not the owner of the event");
    // }
    // if (event.user.toString() === user[0]._id.toString()) {
    //   res.status(200).json({
    //     success: true,
    //     message: "Event fetched successfully",
    //     data: event,
    //   });
    // }
  } catch (error) {
    if (error.message === "Event not found in DB") {
      console.log(`Event not found in DB:
        Event with given todoId not exist in DB or probably deleted by user or admin`);
    } else {
      console.log("Error in getEvent Controller");
      console.log("Error", error);
      res.status(500).json({
        success: false,
        message: "Error in getEvent Controller",
        errorMessage: error.message,
      });
    }
  }
};

/**
 * deleteEvent() - Asynchronous Function
 *  - Destructures the input received in req.params.
 * - Validated if eventId is received.
 * - Validated if eventId received is of type string.
 * - validate if userId is revieved
 * - validate if userId is of type string
 * - Fetches the user with respect to userId/appwriteId in DB using userId (Asynchronous operation - findById())
 * - validate if user exists in DB
 * - Fetches the event with respect to eventId in DB using eventId (Asynchronous operation - findById())
 * - validate if event exists in DB
 * - validate the ownership of user and event
 * - If user is not the owner of event, throws an error.
 * - If user is the owner of event, deletes the event.
 * - Deletes the event from DB using eventId (Asynchronous operation - findByIdAndDelete())
 * - Filter the user events Collection. Filter all the events which was not deleted and store it to user events
 * - save the user (Asynchronous operation - save())
 * - If event deleted successfully, returns the event.
 * - If event not deleted successfully, throws an error.
 */

exports.deleteEvent = async (req, res) => {
  console.log("inside the delete event controller");
  try {
    const { eventId, userId } = req.params;
    if (!eventId) {
      throw new Error("eventId is required");
    }
    if (typeof eventId !== "string") {
      throw new Error("eventId should be of type string");
    }

    if (!userId) {
      throw new Error("userId is required");
    }
    if (typeof userId !== "string") {
      throw new Error("userId should be of type string");
    }

    const user = await User.find({ appwriteId: userId.trim() });
    const event = await Event.findByIdAndDelete(eventId.trim());

    if (!user) {
      throw new Error("User not found in DB");
    }

    if (!event) {
      throw new Error("Event not found in DB");
    }

    if (event.user.equals(user[0]._id) === false) {
      throw new Error("User is not the owner of the event");
    }

    // const deletedEvent = await Reminder.findByIdAndDelete(eventId);

    user[0].events = user[0].events.filter(
      //   (eventObj) => eventObj.toString() !== deletedEvent._id.toString()
      (eventObj) => eventObj.equals(eventId) === false
    );

    await user[0].save();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: event,
    });
  } catch (error) {
    if (error.message === "Event not found in DB") {
      console.log(`Event not found in DB:
            Event with given eventid not exist in DB or probably deleted by user or admin`);
    } else {
      console.log("Error in deleteEvent Controller");
      console.log("Error", error);
      res.status(500).json({
        success: false,
        message: "Error in deleteEvent Controller",
        errorMessage: error.message,
      });
    }
  }
  /**
     * try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }
    const reminder = await Reminder.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      reminder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      errorMessage: error.message,
    });
  }
     */
};
