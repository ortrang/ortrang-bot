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
          console.log("ลงทะเบียน",detail);
          if (detail.data.status === true) {
            ReplyRegister(replyToken, "เคยมีการลงทะเบียนแล้วค่ะ \udbc0\udcb3");
          } else {
            request(
              {
                method: "GET",
                uri: `https://api.line.me/v2/bot/profile//${useridline}`,
                headers: LINE_HEADER,
              },
              (err, res, body) => {
                const detail2 = JSON.parse(body);
                ReplyDetailRegister(replyToken, detail2)
                
              })
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
    } 
  }

  if (req.body.events[0].type == "postback") {
    if (req.body.events[0].postback.data === "ตกลง") {
      
      request(
        {
          method: "GET",
          uri: `https://api.line.me/v2/bot/profile//${useridline}`,
          headers: LINE_HEADER,
        },
        (err, res, body) => {
          const detail = JSON.parse(body);
          const bodyJSON = {
            prefixes: "",
            name: "",
            gender: "",
            age: "",
            birthday: "",
            address: "",
            tel: "",
            rights: "",
            telcontact: "",
            status: true,
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
              ReplyQuiz(replyToken);
            }
          });
        }
      )
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
    } else if (req.body.events[0].postback.data === "การผ่าตัดไส้เลื่อนขาหนีบ") {
      ReplyContent1(replyToken);
    } else if (req.body.events[0].postback.data === "การปฏิบัติตัวเข้ารับผ่าตัด") {
      ReplyContent2(replyToken);
    } else if (req.body.events[0].postback.data === "พูดคุยกับเจ้าหน้าที่") {
      Replyofficer(replyToken);
    }
  }

  //res.send('Hi');
};

function ReplyQuiz(replyToken){
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
              direction: "rtl",
              hero: {
                type: "image",
                url: "https://bored-beret-jay.cyclic.app/images/Quiz02.jpg",
                size: "full",
                aspectRatio: "1.51:1",
                aspectMode: "fit",
                action: {
                  type: "uri",
                  label: "คลิกที่นี่",
                  uri: "https://docs.google.com/forms/d/e/1FAIpQLSeHRtAhKrdSw0Q70W5xgeQiHyTNRUF4VeAmfVK-U_g8BXrU6Q/viewform?openExternalBrowser=1",
                },
              },
            },
            // {
            //   type: "bubble",
            //   direction: "ltr",
            //   hero: {
            //     type: "image",
            //     url: "https://bored-beret-jay.cyclic.app/images/menu02.jpg",
            //     size: "full",
            //     aspectRatio: "1.51:1",
            //     aspectMode: "fit",
            //     action: {
            //       type: "uri",
            //       label: "คลิกที่นี่",
            //       uri: "https://docs.google.com/presentation/d/1mFd0XAiR5VzCS5DaeS55dNNHm4Ecg13HwJKnJj0Pgyg/edit?usp=sharing",
            //     },
            //   },
            // },
            // {
            //   type: "bubble",
            //   direction: "ltr",
            //   hero: {
            //     type: "image",
            //     url: "https://bored-beret-jay.cyclic.app/images/menu03.jpg",
            //     size: "full",
            //     aspectRatio: "1.51:1",
            //     aspectMode: "fit",
            //     action: {
            //       type: "uri",
            //       label: "คลิกที่นี่",
            //       uri: "https://docs.google.com/presentation/d/1spBj3NFmlqqC6x6nvDGeRJeLhCuKFdJwcsko7Fux4Oo/edit?usp=sharing",
            //     },
            //   },
            // },
            // {
            //   type: "bubble",
            //   direction: "ltr",
            //   hero: {
            //     type: "image",
            //     url: "https://bored-beret-jay.cyclic.app/images/menu04.jpg",
            //     size: "full",
            //     aspectRatio: "1.51:1",
            //     aspectMode: "fit",
            //     action: {
            //       type: "uri",
            //       label: "คลิกที่นี่",
            //       uri: "https://docs.google.com/presentation/d/18tgTD3CeO6eqbNP09P8s9ti4TEU6oc7vvEXb8WELkow/edit?usp=sharing",
            //     },
            //   },
            // },
          ],
        },
      },
    ],
  });
  DetailReply(body);

}

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
    if (stepdelete.status === "OK") {
      ReplyRegister(replyToken, "กรุณากดเมนูลงทะเบียนอีกครั้งค่ะ");
    }
  });
};

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
function ReplyDetailRegister(replyToken, data) {
  console.log("สำเร็จ", data);

  // const datebirthday = new Date(data.birthday);

  // let month = datebirthday.getMonth() + 1; // 11
  // let day = datebirthday.getDate(); // 29
  // let year = datebirthday.getFullYear(); // 2011

  // let birthdayfull = day + "/" + month + "/" + year;
  // console.log("birthdayfull", birthdayfull);

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
                    text: "ลงทะเบียน",
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
                url: data.pictureUrl,
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
                        text: "line name : " + data.displayName,
                        color: "#467EAC",
                        wrap: true,
                        align: "center"
                      },
                      // {
                      //   type: "text",
                      //   text: "คำนำหน้าชื่อ : " + data.prefixes,
                      //   color: "#467EAC",
                      //   wrap: true,
                      // },
                      // {
                      //   type: "text",
                      //   text: "ชื่อ : " + data.name,
                      //   color: "#467EAC",
                      //   wrap: true,
                      // },
                      // {
                      //   type: "text",
                      //   text: "เพศ : " + data.gender,
                      //   color: "#467EAC",
                      //   wrap: true,
                      // },
                      // {
                      //   type: "text",
                      //   text: "วันเกิด : " + birthdayfull,
                      //   color: "#467EAC",
                      //   wrap: true,
                      // },
                      // {
                      //   type: "text",
                      //   text: "อายุ : " + data.age,
                      //   color: "#467EAC",
                      //   wrap: true,
                      // },
                      // {
                      //   type: "text",
                      //   text: "เบอร์ : " + data.tel,
                      //   color: "#467EAC",
                      //   wrap: true,
                      // },
                      // {
                      //   type: "text",
                      //   text: "ที่อยู่ : " + data.address,
                      //   color: "#467EAC",
                      //   wrap: true,
                      // },
                      // {
                      //   type: "text",
                      //   text: "ใช้สิทธิ์ : " + data.rights,
                      //   color: "#467EAC",
                      //   wrap: true,
                      // },
                      // {
                      //   type: "text",
                      //   text: "เบอร์ติดต่อฉุกเฉิน : " + data.telcontact,
                      //   color: "#467EAC",
                      //   wrap: true,
                      // },
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

  // let body = JSON.stringify({
  //   replyToken: replyToken,
  //   messages: [
  //     {
  //       type: "flex",
  //       altText: "Flex Message",
  //       contents: {
  //         type: "carousel",
  //         contents: [
  //           {
  //             type: "bubble",
  //             direction: "ltr",
  //             header: {
  //               type: "box",
  //               layout: "vertical",
  //               contents: [
  //                 {
  //                   type: "text",
  //                   text: "ข้อมูลการลงทะเบียน",
  //                   weight: "bold",
  //                   size: "md",
  //                   color: "#1469DCFF",
  //                   align: "center",
  //                   contents: [],
  //                 },
  //               ],
  //             },
  //             hero: {
  //               type: "image",
  //               url: data.lineimg,
  //               size: "full",
  //               aspectRatio: "1.51:1",
  //               aspectMode: "fit",
  //             },
  //             body: {
  //               type: "box",
  //               layout: "vertical",
  //               spacing: "sm",
  //               margin: "none",
  //               contents: [
  //                 {
  //                   type: "box",
  //                   layout: "vertical",
  //                   contents: [
  //                     {
  //                       type: "text",
  //                       text: "line name : " + data.linename,
  //                       color: "#467EAC",
  //                       wrap: true,
  //                     },
  //                     {
  //                       type: "text",
  //                       text: "คำนำหน้าชื่อ : " + data.prefixes,
  //                       color: "#467EAC",
  //                       wrap: true,
  //                     },
  //                     {
  //                       type: "text",
  //                       text: "ชื่อ : " + data.name,
  //                       color: "#467EAC",
  //                       wrap: true,
  //                     },
  //                     {
  //                       type: "text",
  //                       text: "เพศ : " + data.gender,
  //                       color: "#467EAC",
  //                       wrap: true,
  //                     },
  //                     {
  //                       type: "text",
  //                       text: "วันเกิด : " + birthdayfull,
  //                       color: "#467EAC",
  //                       wrap: true,
  //                     },
  //                     {
  //                       type: "text",
  //                       text: "อายุ : " + data.age,
  //                       color: "#467EAC",
  //                       wrap: true,
  //                     },
  //                     {
  //                       type: "text",
  //                       text: "เบอร์ : " + data.tel,
  //                       color: "#467EAC",
  //                       wrap: true,
  //                     },
  //                     {
  //                       type: "text",
  //                       text: "ที่อยู่ : " + data.address,
  //                       color: "#467EAC",
  //                       wrap: true,
  //                     },
  //                     {
  //                       type: "text",
  //                       text: "ใช้สิทธิ์ : " + data.rights,
  //                       color: "#467EAC",
  //                       wrap: true,
  //                     },
  //                     {
  //                       type: "text",
  //                       text: "เบอร์ติดต่อฉุกเฉิน : " + data.telcontact,
  //                       color: "#467EAC",
  //                       wrap: true,
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //             footer: {
  //               type: "box",
  //               layout: "horizontal",
  //               contents: [
  //                 {
  //                   type: "button",
  //                   action: {
  //                     type: "postback",
  //                     label: "ยกเลิก",
  //                     text: "ยกเลิก",
  //                     data: "ยกเลิก",
  //                   },
  //                 },
  //                 {
  //                   type: "button",
  //                   action: {
  //                     type: "postback",
  //                     label: "ตกลง",
  //                     text: "ตกลง",
  //                     data: "ตกลง",
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   ],
  // });
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
                label: "การผ่าตัดไส้เลื่อนขาหนีบ",
                data: "การผ่าตัดไส้เลื่อนขาหนีบ",
                displayText: "การผ่าตัดไส้เลื่อนขาหนีบ",
              },
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "การปฏิบัติตัวเข้ารับผ่าตัด",
                data: "การปฏิบัติตัวเข้ารับผ่าตัด",
                displayText: "การปฏิบัติตัวเข้ารับผ่าตัด",
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
            // {
            //   type: "bubble",
            //   direction: "rtl",
            //   hero: {
            //     type: "image",
            //     url: "https://bored-beret-jay.cyclic.app/images/menu1.jpg",
            //     size: "full",
            //     aspectRatio: "1.51:1",
            //     aspectMode: "fit",
            //     action: {
            //       type: "uri",
            //       label: "คลิกที่นี่",
            //       uri: "https://docs.google.com/presentation/d/1ROjKMayHAtDr74utcyEgc7BFiiNAEwTM_wQ3KFb_WzE/edit?usp=sharing",
            //     },
            //   },
            // },
            {
              type: "bubble",
              direction: "ltr",
              hero: {
                type: "image",
                url: "https://bored-beret-jay.cyclic.app/images/menu02.jpg",
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
                url: "https://bored-beret-jay.cyclic.app/images/menu03.jpg",
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
                url: "https://bored-beret-jay.cyclic.app/images/menu04.jpg",
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
