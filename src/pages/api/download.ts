import { type NextApiRequest, type NextApiResponse } from "next";
import { type drive_v3, google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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
    if (!files?.length) throw new Error("Backup not find");
    const response = await drive.files.get(
      { fileId: files[0].id!, alt: "media" },
      { responseType: "json" }
    );
    res.status(200).send({ data: response.data });
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
