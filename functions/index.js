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
  .schedule('0 0 * * *')
  .timeZone('Asia/Manila')
  .onRun(async (context) => {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0); // Set current date to the start of the day in UTC

    const year = currentDate.getUTCFullYear().toString();
    const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getUTCDate().toString().padStart(2, '0');
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
