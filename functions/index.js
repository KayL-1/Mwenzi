/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
var FieldValue = require('firebase-admin').FieldValue;
const { Firestore } = require('firebase-admin/firestore');
admin.initializeApp();

exports.createDailyAttendance = functions.pubsub
  .schedule('0 4 * * *')
  .timeZone('Asia/Manila')
  .onRun(async (context) => {
    const currentDate = new Date();
    const gmt8Date = new Date(currentDate.valueOf() + 8 * 60 * 60 * 1000); // Adjust the date to GMT+8

    const year = gmt8Date.getUTCFullYear().toString();
    const month = (gmt8Date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = gmt8Date.getUTCDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const subjectSnapshot = await admin.firestore().collection('Subject').get();

    const attendancePromises = [];
    subjectSnapshot.forEach((subjectDoc) => {
      const subjectName = subjectDoc.id;
      const attendanceDocRef = subjectDoc.ref.collection('Attendance').doc(formattedDate);

      const createStudentFieldObject = async () => {
        const studentFieldObject = {};
        const subjectData = subjectDoc.data();
        const students = subjectData.students || []; // Retrieve the 'students' array from the parent document

        students.forEach((student) => {
          studentFieldObject[student] = {
            time: '00:00',
            status: 'Absent',
            late: "False",
            dataStatus: 'unchanged'
          };
        });

        return studentFieldObject;
      };

      const attendancePromise = createStudentFieldObject().then((studentFieldObject) => {
        const attendanceData = studentFieldObject;
        return attendanceDocRef.set(attendanceData);
      });

      attendancePromises.push(attendancePromise);
    });

    try {
      await Promise.all(attendancePromises);
      console.log(`Attendance documents created for ${formattedDate}`);
      return null;
    } catch (error) {
      console.error('Error creating attendance documents:', error);
      return null;
    }
  });
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.resetDailyRecitation = functions.pubsub
.schedule('0 4 * * *')
.timeZone('Asia/Manila')
.onRun(async (context) => {
  try {
    const subjectSnapshot = await admin.firestore().collection('Subject').get();

    subjectSnapshot.forEach(async (subjectDoc) => {
      const attendanceDocRef = subjectDoc.ref.collection('Recitation');
      const recitationSnapshot = await attendanceDocRef.get();

      recitationSnapshot.forEach(async (recitationDoc) => {
        const recitationData = recitationDoc.data();
        console.log("Recitation Document Data: ", recitationData);

        // Update the 'day' field to 0 in each "Recitation" document
        await recitationDoc.ref.update({ day: 0 });
      });
    });

    return null;
  } catch (error) {
    console.error("Error fetching or updating documents: ", error);
    return null;
  }
});

exports.resetWeeklyRecitation = functions.pubsub
  .schedule('0 4 * * 0') // Weekly, every Sunday (0 represents Sunday)
  .timeZone('Asia/Manila')
  .onRun(async (context) => {
    try {
      const subjectSnapshot = await admin.firestore().collection('Subject').get();

      subjectSnapshot.forEach(async (subjectDoc) => {
        const attendanceDocRef = subjectDoc.ref.collection('Recitation');
        const recitationSnapshot = await attendanceDocRef.get();

        recitationSnapshot.forEach(async (recitationDoc) => {
          const recitationData = recitationDoc.data();
          console.log("Recitation Document Data: ", recitationData);

          // Update the 'day' field to 0 in each "Recitation" document
          await recitationDoc.ref.update({ week: 0 });
        });
      });

      return null;
    } catch (error) {
      console.error("Error fetching or updating documents: ", error);
      return null;
    }
  });