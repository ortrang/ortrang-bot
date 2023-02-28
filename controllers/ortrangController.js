const request = require("request-promise");
const config = require("../config/index");

const LINE_MESSAGING_API = config.LINE_MESSAGING_API;
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + config.ACCESSTOKEN,
};

const URL_API = config.URL_API;

exports.index = async (req, res, next) => {
  console.log(req.body);
  console.log(req.body.events[0]);
  let replyToken = req.body.events[0].replyToken;
  let useridline = req.body.events[0].source.userId;

  if (req.body.events[0].type == "message") {
    if (req.body.events[0].message.text === "ลงทะเบียน") {
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          console.log(detail);
          if (detail.data.status === false) {
            ReplyPrefixes(replyToken);
          } else {
            ReplyRegister(replyToken, "เคยมีการลงทะเบียนแล้วค่ะ \udbc0\udcb3");
          }
        }
      );
    } else if (req.body.events[0].message.text === "สาระน่ารู้") {
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          console.log(detail);
          if (detail.data.status === false) {
            ReplyRegister(
              replyToken,
              "ไม่พบข้อมูลค่ะ \n กรุณาลงทะเบียนก่อนนะคะ \udbc0\udc90"
            );
          } else {
            ReplyContent(replyToken);
          }
        }
      );
    } else if (req.body.events[0].message.text === "ติดต่อเจ้าหน้าที่") {
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          console.log(detail);
          if (detail.data.status === false) {
            ReplyRegister(
              replyToken,
              "ไม่พบข้อมูลค่ะ \n กรุณาลงทะเบียนก่อนนะคะ \udbc0\udc90"
            );
          } else {
            Replyofficer(replyToken);
          }
        }
      );
    } else if (
      req.body.events[0].message.text.substring(0, 1) === "T" ||
      req.body.events[0].message.text.substring(0, 1) === "t"
    ) {
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          const telsub = req.body.events[0].message.text.substring(1);
          setToUpdateDB(
            detail.data.step,
            useridline,
            detail.data,
            replyToken,
            telsub
          );
        }
      );
    } else if (
      req.body.events[0].message.text.substring(0, 1) === "H" ||
      req.body.events[0].message.text.substring(0, 1) === "h"
    ) {
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          const addresssub = req.body.events[0].message.text.substring(1);
          setToUpdateDB(
            detail.data.step,
            useridline,
            detail.data,
            replyToken,
            addresssub
          );
        }
      );
    } else if (
      req.body.events[0].message.text.substring(0, 2) === "CT" ||
      req.body.events[0].message.text.substring(0, 2) === "ct"
    ) {
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          const contactsub = req.body.events[0].message.text.substring(2);
          setToUpdateDB(
            detail.data.step,
            useridline,
            detail.data,
            replyToken,
            contactsub
          );
        }
      );
    } else if (
      req.body.events[0].message.text !== "ลงทะเบียน" ||
      req.body.events[0].message.text !== "สาระน่ารู้" ||
      req.body.events[0].message.text !== "ติดต่อเจ้าหน้าที่" ||
      req.body.events[0].message.text.substring(0, 1) !== "T" ||
      req.body.events[0].message.text.substring(0, 1) !== "t" ||
      req.body.events[0].message.text.substring(0, 1) !== "H" ||
      req.body.events[0].message.text.substring(0, 1) !== "h" ||
      req.body.events[0].message.text.substring(0, 2) !== "CT" ||
      req.body.events[0].message.text.substring(0, 2) !== "ct" ||
      req.body.events[0].message.text.substring(0, 2) !== "Ct" ||
      req.body.events[0].message.text.substring(0, 2) !== "cT"
    ) {
      //gender
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          console.log(detail, detail.data.step);
          setToUpdateDB(
            detail.data.step,
            useridline,
            detail.data,
            replyToken,
            req.body.events[0].message.text
          );
        }
      );
    }
  }

  if (req.body.events[0].type == "postback") {
    console.log("test0", req.body.events[0].postback);
    console.log("test1", req.body.events[0].postback.data);
    if (
      req.body.events[0].postback.data === "นาย" ||
      req.body.events[0].postback.data === "นาง" ||
      req.body.events[0].postback.data === "นางสาว" ||
      req.body.events[0].postback.data === "เด็กหญิง" ||
      req.body.events[0].postback.data === "เด็กชาย"
    ) {
      request(
        {
          method: "GET",
          uri: `https://api.line.me/v2/bot/profile//${useridline}`,
          headers: LINE_HEADER,
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          const bodyJSON = {
            prefixes: req.body.events[0].postback.data,
            name: "",
            gender: "",
            age: "",
            birthday: "",
            address: "",
            tel: "",
            rights: "",
            telcontact: "",
            status: false,
            lineid: useridline,
            linename: detail.displayName,
            lineimg: detail.pictureUrl,
            step: "1",
          };

          request({
            method: "POST",
            uri: `${URL_API}/users`,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyJSON),
          }).then((response) => {
            const step1 = JSON.parse(response);
            console.log("STEP1", step1);
            if (step1.status === "OK") {
              ReplyName(replyToken);
            }
          });
        }
      );
    } else if (
      req.body.events[0].postback.data === "ชาย" ||
      req.body.events[0].postback.data === "หญิง"
    ) {
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          setToUpdateDB(
            detail.data.step,
            useridline,
            detail.data,
            replyToken,
            req.body.events[0].postback.data
          );
        }
      );
    } else if (req.body.events[0].postback.data === "Birthday") {
      //console.log("postback", req.body.events[0].postback);

      if (req.body.events[0].postback.params !== undefined) {
        const PickerDate = req.body.events[0].postback.params;
        console.log(PickerDate);
        //ReplyConfirm(replyToken, PickerDate.date);
        request(
          {
            method: "GET",
            uri: `${URL_API}/users/${useridline}`,
            headers: {
              "Content-Type": "application/json",
            },
          },
          (err, res, body) => {
            const detail = JSON.parse(body);
            setToUpdateDB(
              detail.data.step,
              useridline,
              detail.data,
              replyToken,
              PickerDate.date
            );
          }
        );
      }
    } else if (req.body.events[0].postback.data === "ตกลง") {
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          setToUpdateDB(
            detail.data.step,
            useridline,
            detail.data,
            replyToken,
            req.body.events[0].postback.data
          );
        }
      );
    } else if (req.body.events[0].postback.data === "ยกเลิก") {
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          //console.log("delete",detail.data);
          if (detail.data.status === false) {
            setToDeleteDB(replyToken, detail.data);
          } else {
            ReplyRegister(replyToken, "เคยมีการลงทะเบียนแล้วค่ะ \udbc0\udcb3");
          }
        }
      );
    } else if (
      req.body.events[0].postback.data === "1-10" ||
      req.body.events[0].postback.data === "11-20" ||
      req.body.events[0].postback.data === "21-30" ||
      req.body.events[0].postback.data === "31-40" ||
      req.body.events[0].postback.data === "41-50" ||
      req.body.events[0].postback.data === "51-60" ||
      req.body.events[0].postback.data === "61-70" ||
      req.body.events[0].postback.data === "71-80" ||
      req.body.events[0].postback.data === "81-90" ||
      req.body.events[0].postback.data === "91-100"
    ) {
      ReplyNumberAge(replyToken, req.body.events[0].postback.data);
    } else if (req.body.events[0].postback.data.endsWith("ปี") === true) {
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          setToUpdateDB(
            detail.data.step,
            useridline,
            detail.data,
            replyToken,
            req.body.events[0].postback.data
          );
        }
      );
    } else if (
      req.body.events[0].postback.data === "ข้าราชการ" ||
      req.body.events[0].postback.data === "รัฐวิสาหกิจ" ||
      req.body.events[0].postback.data === "ประกันสุขภาพ" ||
      req.body.events[0].postback.data === "ประกันสังคม" ||
      req.body.events[0].postback.data === "เงินสด"
    ) {
      request(
        {
          method: "GET",
          uri: `${URL_API}/users/${useridline}`,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          setToUpdateDB(
            detail.data.step,
            useridline,
            detail.data,
            replyToken,
            req.body.events[0].postback.data
          );
        }
      );
    } else if (req.body.events[0].postback.data === "การจัดการไส้เลื่อน") {
      ReplyContent1(replyToken);
    } else if (req.body.events[0].postback.data === "การผ่าตัดถุงน้ำดี") {
      ReplyContent2(replyToken);
    } else if (req.body.events[0].postback.data === "พูดคุยกับเจ้าหน้าที่") {
      Replyoffice2(replyToken);
    }
  }

  //res.send('Hi');
};

const setToDeleteDB = async (replyToken, body) => {
  const { _id: id } = body;
  await request({
    method: "DELETE",
    uri: `${URL_API}/users/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    const stepdelete = JSON.parse(response);
    //console.log("DELETE",stepdelete)
    if (stepdelete.status === "OK") {
      ReplyRegister(replyToken, "กรุณากดเมนูลงทะเบียนอีกครั้งค่ะ");
    }
  });
};

const setToUpdateDB = async (
  stepname,
  useridline,
  body,
  replyToken,
  textupdate
) => {
  const {
    _id: id,
    prefixes,
    name,
    gender,
    age,
    birthday,
    address,
    tel,
    rights,
    telcontact,
    status,
    lineid,
    linename,
    lineimg,
    step,
  } = body;

  let bodyJSON = "";
  if (stepname === "1") {
    bodyJSON = {
      _id: id,
      prefixes: prefixes,
      name: textupdate,
      gender: "",
      age: "",
      birthday: "",
      address: "",
      tel: "",
      rights: "",
      telcontact: "",
      status: status,
      lineid: useridline,
      linename: linename,
      lineimg: lineimg,
      step: "2",
    };
  } else if (stepname === "2") {
    bodyJSON = {
      _id: id,
      prefixes: prefixes,
      name: name,
      gender: textupdate,
      age: "",
      birthday: "",
      address: "",
      tel: "",
      rights: "",
      telcontact: "",
      status: status,
      lineid: useridline,
      linename: linename,
      lineimg: lineimg,
      step: "3",
    };
  } else if (stepname === "3") {
    bodyJSON = {
      _id: id,
      prefixes: prefixes,
      name: name,
      gender: gender,
      age: "",
      birthday: textupdate,
      address: "",
      tel: "",
      rights: "",
      telcontact: "",
      status: status,
      lineid: useridline,
      linename: linename,
      lineimg: lineimg,
      step: "4",
    };
  } else if (stepname === "4") {
    bodyJSON = {
      _id: id,
      prefixes: prefixes,
      name: name,
      gender: gender,
      age: textupdate,
      birthday: birthday,
      address: "",
      tel: "",
      rights: "",
      telcontact: "",
      status: status,
      lineid: useridline,
      linename: linename,
      lineimg: lineimg,
      step: "5",
    };
  } else if (stepname === "5") {
    bodyJSON = {
      _id: id,
      prefixes: prefixes,
      name: name,
      gender: gender,
      age: age,
      birthday: birthday,
      address: "",
      tel: textupdate,
      rights: "",
      telcontact: "",
      status: status,
      lineid: useridline,
      linename: linename,
      lineimg: lineimg,
      step: "6",
    };
  } else if (stepname === "6") {
    bodyJSON = {
      _id: id,
      prefixes: prefixes,
      name: name,
      gender: gender,
      age: age,
      birthday: birthday,
      address: textupdate,
      tel: tel,
      rights: "",
      telcontact: "",
      status: status,
      lineid: useridline,
      linename: linename,
      lineimg: lineimg,
      step: "7",
    };
  } else if (stepname === "7") {
    bodyJSON = {
      _id: id,
      prefixes: prefixes,
      name: name,
      gender: gender,
      age: age,
      birthday: birthday,
      address: address,
      tel: tel,
      rights: textupdate,
      telcontact: "",
      status: status,
      lineid: useridline,
      linename: linename,
      lineimg: lineimg,
      step: "8",
    };
  } else if (stepname === "8") {
    bodyJSON = {
      _id: id,
      prefixes: prefixes,
      name: name,
      gender: gender,
      age: age,
      birthday: birthday,
      address: address,
      tel: tel,
      rights: rights,
      telcontact: textupdate,
      status: status,
      lineid: useridline,
      linename: linename,
      lineimg: lineimg,
      step: "9",
    };
  } else if (stepname === "9") {
    bodyJSON = {
      _id: id,
      prefixes: prefixes,
      name: name,
      gender: gender,
      age: age,
      birthday: birthday,
      address: address,
      tel: tel,
      rights: rights,
      telcontact: telcontact,
      status: true,
      lineid: useridline,
      linename: linename,
      lineimg: lineimg,
      step: "10",
    };
  }

  const dateBirthday = formatDate(new Date());
  switch (stepname) {
    case "1":
      await request({
        method: "PUT",
        uri: `${URL_API}/users/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyJSON),
      }).then((response) => {
        const step2 = JSON.parse(response);
        if (step2.status === "OK") {
          ReplyGender(replyToken);
        }
      });
      break;
    case "2":
      await request({
        method: "PUT",
        uri: `${URL_API}/users/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyJSON),
      }).then((response) => {
        const step3 = JSON.parse(response);
        if (step3.status === "OK") {
          ReplyBirthday(replyToken, dateBirthday);
        }
      });
      break;
    case "3":
      await request({
        method: "PUT",
        uri: `${URL_API}/users/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyJSON),
      }).then((response) => {
        const step4 = JSON.parse(response);
        if (step4.status === "OK") {
          ReplyAge(replyToken);
        }
      });
      break;
    case "4":
      await request({
        method: "PUT",
        uri: `${URL_API}/users/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyJSON),
      }).then((response) => {
        const step5 = JSON.parse(response);
        if (step5.status === "OK") {
          ReplyTel(replyToken);
        }
      });
      break;
    case "5":
      await request({
        method: "PUT",
        uri: `${URL_API}/users/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyJSON),
      }).then((response) => {
        const step6 = JSON.parse(response);
        if (step6.status === "OK") {
          ReplyAddress(replyToken);
        }
      });
      break;
    case "6":
      await request({
        method: "PUT",
        uri: `${URL_API}/users/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyJSON),
      }).then((response) => {
        const step7 = JSON.parse(response);
        if (step7.status === "OK") {
          ReplyRights(replyToken);
        }
      });
      break;
    case "7":
      await request({
        method: "PUT",
        uri: `${URL_API}/users/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyJSON),
      }).then((response) => {
        const step8 = JSON.parse(response);
        if (step8.status === "OK") {
          ReplyTelContact(replyToken);
        }
      });
      break;
    case "8":
      await request({
        method: "PUT",
        uri: `${URL_API}/users/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyJSON),
      }).then((response) => {
        const step9 = JSON.parse(response);
        if (step9.status === "OK") {
          ReplyDetailRegister(replyToken, step9.data);
        }
      });
      break;
    case "9":
      await request({
        method: "PUT",
        uri: `${URL_API}/users/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyJSON),
      }).then((response) => {
        const step10 = JSON.parse(response);
        if (step10.status === "OK") {
          ReplySuccess(replyToken);
        }
      });
      break;
  }
};

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function ReplyRegister(replyToken, text) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: text,
      },
    ],
  });
  DetailReply(body);
}

function ReplySuccess(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "\udbc0\udc8d ลงทะเบียนเสร็จเรียบร้อยค่ะ",
      },
    ],
  });
  DetailReply(body);
}

function ReplyPrefixes(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกคำนำหน้าชื่อ",

        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "นาย",
                data: "นาย",
                displayText: "นาย",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "นาง",
                data: "นาง",
                displayText: "นาง",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "นางสาว",
                data: "นางสาว",
                displayText: "นางสาว",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "เด็กชาย",
                data: "เด็กชาย",
                displayText: "เด็กชาย",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "เด็กหญิง",
                data: "เด็กหญิง",
                displayText: "เด็กหญิง",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}
function ReplyName(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "$ กรอกชื่อ-นามสกุล\n(โดยไม่ต้องใส่คำนำหน้า)",
        emojis: [
          {
            index: 0,
            productId: "5ac1bfd5040ab15980c9b435",
            emojiId: "009",
          },
        ],
      },
    ],
  });
  DetailReply(body);
}
function ReplyGender(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกเพศ",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "ชาย",
                data: "ชาย",
                displayText: "ชาย",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "หญิง",
                data: "หญิง",
                displayText: "หญิง",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}
function ReplyBirthday(replyToken, dateBirthday) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกวันเกิด",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "datetimepicker",
                label: "Birthday",
                data: "Birthday",
                mode: "date",
                initial: dateBirthday,
                // max: "2023-12-01",
                // min: "2023-01-01",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}

function ReplyConfirm(replyToken, date) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "วันเกิด " + date,
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "ตกลง",
                data: "ตกลง",
                Text: "ตกลง",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "ยกเลิก",
                data: "ยกเลิก",
                Text: "ยกเลิก",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}
function ReplyAge(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกช่วงอายุ",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "1-10",
                data: "1-10",
                displayText: "1-10",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "11-20",
                data: "11-20",
                displayText: "11-20",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "21-30",
                data: "21-30",
                displayText: "21-30",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "31-40",
                data: "31-40",
                displayText: "31-40",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "41-50",
                data: "41-50",
                displayText: "41-50",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "51-60",
                data: "51-60",
                displayText: "51-60",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "61-70",
                data: "61-70",
                displayText: "61-70",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "71-80",
                data: "71-80",
                displayText: "71-80",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "81-90",
                data: "81-90",
                displayText: "81-90",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "91-100",
                data: "91-100",
                displayText: "91-100",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}
function ReplyNumberAge(replyToken, Range) {
  let Range1 = 0;
  let Range2 = 0;
  let Range3 = 0;
  let Range4 = 0;
  let Range5 = 0;
  let Range6 = 0;
  let Range7 = 0;
  let Range8 = 0;
  let Range9 = 0;
  let Range10 = 0;
  if (Range === "1-10") {
    Range1 = 1 + " ปี";
    Range2 = 2 + " ปี";
    Range3 = 3 + " ปี";
    Range4 = 4 + " ปี";
    Range5 = 5 + " ปี";
    Range6 = 6 + " ปี";
    Range7 = 7 + " ปี";
    Range8 = 8 + " ปี";
    Range9 = 9 + " ปี";
    Range10 = 10 + " ปี";
  } else if (Range === "11-20") {
    Range1 = 11 + " ปี";
    Range2 = 12 + " ปี";
    Range3 = 13 + " ปี";
    Range4 = 14 + " ปี";
    Range5 = 15 + " ปี";
    Range6 = 16 + " ปี";
    Range7 = 17 + " ปี";
    Range8 = 18 + " ปี";
    Range9 = 19 + " ปี";
    Range10 = 20 + " ปี";
  } else if (Range === "21-30") {
    Range1 = 21 + " ปี";
    Range2 = 22 + " ปี";
    Range3 = 23 + " ปี";
    Range4 = 24 + " ปี";
    Range5 = 25 + " ปี";
    Range6 = 26 + " ปี";
    Range7 = 27 + " ปี";
    Range8 = 28 + " ปี";
    Range9 = 29 + " ปี";
    Range10 = 30 + " ปี";
  } else if (Range === "31-40") {
    Range1 = 31 + " ปี";
    Range2 = 32 + " ปี";
    Range3 = 33 + " ปี";
    Range4 = 34 + " ปี";
    Range5 = 35 + " ปี";
    Range6 = 36 + " ปี";
    Range7 = 37 + " ปี";
    Range8 = 38 + " ปี";
    Range9 = 29 + " ปี";
    Range10 = 40 + " ปี";
  } else if (Range === "41-50") {
    Range1 = 41 + " ปี";
    Range2 = 42 + " ปี";
    Range3 = 43 + " ปี";
    Range4 = 44 + " ปี";
    Range5 = 45 + " ปี";
    Range6 = 46 + " ปี";
    Range7 = 47 + " ปี";
    Range8 = 48 + " ปี";
    Range9 = 49 + " ปี";
    Range10 = 50 + " ปี";
  } else if (Range === "51-60") {
    Range1 = 51 + " ปี";
    Range2 = 52 + " ปี";
    Range3 = 53 + " ปี";
    Range4 = 54 + " ปี";
    Range5 = 55 + " ปี";
    Range6 = 56 + " ปี";
    Range7 = 57 + " ปี";
    Range8 = 58 + " ปี";
    Range9 = 59 + " ปี";
    Range10 = 60 + " ปี";
  } else if (Range === "61-70") {
    Range1 = 61 + " ปี";
    Range2 = 62 + " ปี";
    Range3 = 63 + " ปี";
    Range4 = 64 + " ปี";
    Range5 = 65 + " ปี";
    Range6 = 66 + " ปี";
    Range7 = 67 + " ปี";
    Range8 = 68 + " ปี";
    Range9 = 69 + " ปี";
    Range10 = 70 + " ปี";
  } else if (Range === "71-80") {
    Range1 = 71 + " ปี";
    Range2 = 72 + " ปี";
    Range3 = 73 + " ปี";
    Range4 = 74 + " ปี";
    Range5 = 75 + " ปี";
    Range6 = 76 + " ปี";
    Range7 = 77 + " ปี";
    Range8 = 78 + " ปี";
    Range9 = 79 + " ปี";
    Range10 = 80 + " ปี";
  } else if (Range === "81-90") {
    Range1 = 81 + " ปี";
    Range2 = 82 + " ปี";
    Range3 = 83 + " ปี";
    Range4 = 84 + " ปี";
    Range5 = 85 + " ปี";
    Range6 = 86 + " ปี";
    Range7 = 87 + " ปี";
    Range8 = 88 + " ปี";
    Range9 = 89 + " ปี";
    Range10 = 90 + " ปี";
  } else if (Range === "91-100") {
    Range1 = 91 + " ปี";
    Range2 = 92 + " ปี";
    Range3 = 93 + " ปี";
    Range4 = 94 + " ปี";
    Range5 = 95 + " ปี";
    Range6 = 96 + " ปี";
    Range7 = 97 + " ปี";
    Range8 = 98 + " ปี";
    Range9 = 99 + " ปี";
    Range10 = 100 + " ปี";
  }

  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกอายุ",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: Range1,
                data: Range1,
                displayText: Range1,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range2,
                data: Range2,
                displayText: Range2,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range3,
                data: Range3,
                displayText: Range3,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range4,
                data: Range4,
                displayText: Range4,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range5,
                data: Range5,
                displayText: Range5,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range6,
                data: Range6,
                displayText: Range6,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range7,
                data: Range7,
                displayText: Range7,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range8,
                data: Range8,
                displayText: Range8,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range9,
                data: Range9,
                displayText: Range9,
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: Range10,
                data: Range10,
                displayText: Range10,
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}
function ReplyTel(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "\udbc0\udc8d กรอกเบอร์โทร \n(พิมพ์ T แล้วตามด้วยเบอร์โทร ตัวอย่าง T099xxxxxxx)",
      },
    ],
  });
  DetailReply(body);
}

function ReplyAddress(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "\udbc0\udc8d กรอกที่อยู่ \n(พิมพ์ H แล้วตามด้วยที่อยู่)",
      },
    ],
  });
  DetailReply(body);
}
function ReplyRights(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "เลือกสิทธิ์ในการรักษาพยาบาล",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "ข้าราชการ",
                data: "ข้าราชการ",
                displayText: "ข้าราชการ",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "รัฐวิสาหกิจ",
                data: "รัฐวิสาหกิจ",
                displayText: "รัฐวิสาหกิจ",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "ประกันสุขภาพ",
                data: "ประกันสุขภาพ",
                displayText: "ประกันสุขภาพ",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "ประกันสังคม",
                data: "ประกันสังคม",
                displayText: "ประกันสังคม",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "เงินสด",
                data: "เงินสด",
                displayText: "เงินสด",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}

function ReplyTelContact(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "\udbc0\udc8d กรอกเบอร์โทรติดต่อฉุกเฉิน \n(พิมพ์ CT แล้วตามด้วยเบอร์โทร ตัวอย่าง CT099xxxxxxx)",
      },
    ],
  });
  DetailReply(body);
}

function ReplyDetailRegister(replyToken, data) {
  console.log("สำเร็จ", data);

  const datebirthday = new Date(data.birthday);

  let month = datebirthday.getMonth() + 1; // 11
  let day = datebirthday.getDate(); // 29
  let year = datebirthday.getFullYear(); // 2011

  let birthdayfull = day + "/" + month + "/" + year;
  console.log("birthdayfull", birthdayfull);

  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "carousel",
          contents: [
            {
              type: "bubble",
              direction: "ltr",
              header: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "ข้อมูลการลงทะเบียน",
                    weight: "bold",
                    size: "md",
                    color: "#1469DCFF",
                    align: "center",
                    contents: [],
                  },
                ],
              },
              hero: {
                type: "image",
                url: data.lineimg,
                size: "full",
                aspectRatio: "1.51:1",
                aspectMode: "fit",
              },
              body: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                margin: "none",
                contents: [
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: "line name : " + data.linename,
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "คำนำหน้าชื่อ : " + data.prefixes,
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "ชื่อ : " + data.name,
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "เพศ : " + data.gender,
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "วันเกิด : " + birthdayfull,
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "อายุ : " + data.age,
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "เบอร์ : " + data.tel,
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "ที่อยู่ : " + data.address,
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "ใช้สิทธิ์ : " + data.rights,
                        color: "#467EAC",
                        wrap: true,
                      },
                      {
                        type: "text",
                        text: "เบอร์ติดต่อฉุกเฉิน : " + data.telcontact,
                        color: "#467EAC",
                        wrap: true,
                      },
                    ],
                  },
                ],
              },
              footer: {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "ยกเลิก",
                      text: "ยกเลิก",
                      data: "ยกเลิก",
                    },
                  },
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "ตกลง",
                      text: "ตกลง",
                      data: "ตกลง",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}

function ReplyContent(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: "สาระน่ารู้ \udbc0\udc8f",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "postback",
                label: "การจัดการไส้เลื่อน",
                data: "การจัดการไส้เลื่อน",
                displayText: "การจัดการไส้เลื่อน",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "การผ่าตัดถุงน้ำดี",
                data: "การผ่าตัดถุงน้ำดี",
                displayText: "การผ่าตัดถุงน้ำดี",
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}
function ReplyContent1(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "carousel",
          contents: [
            {
              type: "bubble",
              header: {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "การจัดการไส้เลื่อน",
                    weight: "bold",
                    size: "lg",
                    align: "center",
                    contents: [],
                  },
                ],
              },
              hero: {
                type: "image",
                url: "https://bored-beret-jay.cyclic.app/images/imgvideo.jpg",
                size: "full",
                aspectRatio: "1.52:1",
                aspectMode: "cover",
                action: {
                  type: "uri",
                  label: "Action",
                  uri: "https://linecorp.com/",
                },
              },
              footer: {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "uri",
                      label: "Play",
                      uri: "https://youtu.be/vr9_59-e-yI",
                    },
                    color: "#03B0AFFF",
                    gravity: "center",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}

function ReplyContent2(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "carousel",
          contents: [
            {
              type: "bubble",
              direction: "ltr",
              hero: {
                type: "image",
                url: "https://bored-beret-jay.cyclic.app/images/menu2.jpg",
                size: "full",
                aspectRatio: "1.51:1",
                aspectMode: "fit",
                action: {
                  type: "uri",
                  label: "คลิกที่นี่",
                  uri: "https://docs.google.com/presentation/d/1mFd0XAiR5VzCS5DaeS55dNNHm4Ecg13HwJKnJj0Pgyg/edit?usp=sharing",
                },
              },
            },
            {
              type: "bubble",
              direction: "ltr",
              hero: {
                type: "image",
                url: "https://bored-beret-jay.cyclic.app/images/menu3.jpg",
                size: "full",
                aspectRatio: "1.51:1",
                aspectMode: "fit",
                action: {
                  type: "uri",
                  label: "คลิกที่นี่",
                  uri: "https://docs.google.com/presentation/d/1spBj3NFmlqqC6x6nvDGeRJeLhCuKFdJwcsko7Fux4Oo/edit?usp=sharing",
                },
              },
            },
            {
              type: "bubble",
              direction: "ltr",
              hero: {
                type: "image",
                url: "https://bored-beret-jay.cyclic.app/images/menu4.jpg",
                size: "full",
                aspectRatio: "1.51:1",
                aspectMode: "fit",
                action: {
                  type: "uri",
                  label: "คลิกที่นี่",
                  uri: "https://docs.google.com/presentation/d/18tgTD3CeO6eqbNP09P8s9ti4TEU6oc7vvEXb8WELkow/edit?usp=sharing",
                },
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}

function Replyofficer(replyToken) {
  let body = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "carousel",
          contents: [
            {
              type: "bubble",
              direction: "ltr",
              header: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "พูดคุยกับเจ้าหน้าที่",
                    weight: "bold",
                    size: "xl",
                    align: "center",
                    contents: [],
                  },
                ],
              },
              hero: {
                type: "image",
                url: "https://media.istockphoto.com/id/1224838022/vector/customer-service-woman-operator-call-center-with-headphones-and-microphone-with-laptop.jpg?s=612x612&w=0&k=20&c=afWsgGVk5IBg_CmMrYZgmyyCH25M7mGyUO8NCdWvTOA=",
                size: "full",
                aspectRatio: "1.51:1",
                aspectMode: "fit",
              },
              footer: {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "uri",
                      label: "คลิกที่นี่",
                      uri: "https://line.me/R/ti/p/@156qokll",
                    },
                    color: "#04A9A9FF",
                    margin: "lg",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
  DetailReply(body);
}

function DetailReply(body) {
  console.log(LINE_HEADER);
  request.post(
    {
      url: `${LINE_MESSAGING_API}/reply`,
      headers: LINE_HEADER,
      body: body,
    },
    (err, res, body) => {
      console.log("err = " + err);
      console.log("status = " + res.statusCode);
    }
  );
}
