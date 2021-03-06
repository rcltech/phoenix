interface EmailTemplateData {
  first_name: string;
  room_detail: string;
  date: string;
  start_time: string;
  end_time: string;
}

export const getEmailContent = (
  emailTemplateData: EmailTemplateData
): string => {
  const {
    first_name,
    room_detail,
    date,
    start_time,
    end_time,
  } = emailTemplateData;
  return `<html>
            <body>
              <div class='content'>
                <p>Dear ${first_name},</p>
                <br/>
                <p>Your booking for ${room_detail} on ${date} at ${start_time} to ${end_time} has been confirmed!</p>
                <p>Thanks for using our service, have a nice day!</p>
              </div>
              <br/><br/>
              <div class='signature'>
                <p>--</p>
                <p>Owl by RC Tech Club</p>
                <p>6A Sassoon Road, R.C Lee Hall</p>
                <a href="mailto:owl@rctech.club">owl@rctech.club</a>
                <br/>
                <a href="rctech.club">rctech.club</a>
              </div>
            </body>
          </html>`;
};
