// eslint-disable-next-line no-unused-vars
import { NextApiRequest, NextApiResponse } from "next";
import { type drive_v3, google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = req.body as string;
    const mimeType = req.headers["mimetype"] as string;
    const clientId = req.headers["client_id"] as string;
    const clientSecret = req.headers["client_secret"] as string;
    const redirectUri = req.headers["redirect_uri"] as string;
    const refreshToken = req.headers["refresh_token"] as string;
    const name = "money-manager-db.json";

    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const files = await searchFile(name, drive);
    if (files && files?.length) {
      const response = await drive.files.update({
        fileId: files[0].id!,
        media: { mimeType, body },
        fields: "id",
      });
      return res.status(200).send(response.data);
    }
    const response = await drive.files.create({
      requestBody: { name },
      media: { mimeType, body },
      fields: "id",
    });
    res.status(200).send(response.data);
  } catch (error) {
    res.status(400).send({ message: (error as Error).message, error: true });
  }
}

const searchFile = async (fileName: string, drive: drive_v3.Drive) => {
  try {
    const response = await drive.files.list({
      q: `name='${fileName}' and trashed=false`,
      fields: "files(id, name)",
    });
    return response.data.files;
  } catch (error) {
    console.error("Error searching for the file:", (error as Error).message);
    throw error;
  }
};
