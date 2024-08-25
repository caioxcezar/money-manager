// eslint-disable-next-line no-unused-vars
import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
/**
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<ResponseData>} res
 */
export default async function handler(req, res) {
  try {
    const clientId = req.headers["client_id"];
    const clientSecret = req.headers["client_secret"];
    const redirectUri = req.headers["redirect_uri"];
    const refreshToken = req.headers["refresh_token"];
    const name = "money-manager-db.json";

    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const files = await searchFile(name, drive);
    if (!files.length) throw new Error("Backup not find");
    const response = await drive.files.get(
      { fileId: files[0].id, alt: "media" },
      { responseType: "application/json" }
    );
    res.status(200).send({ data: response.data });
  } catch (error) {
    res.status(400).send({ message: error.message, error: true });
  }
}

const searchFile = async (fileName, drive) => {
  try {
    const response = await drive.files.list({
      q: `name='${fileName}' and trashed=false`,
      fields: "files(id, name)",
    });
    return response.data.files;
  } catch (error) {
    console.error("Error searching for the file:", error.message);
    throw error;
  }
};
