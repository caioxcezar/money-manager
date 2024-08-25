"use client";
import React, { useEffect, useState } from "react";
import Page from "@/components/page";
import Button from "@/components/button";
import Database from "@/dao/database";
import { toast } from "react-toastify";
import Input from "@/components/input";
import useRequest from "@/hooks/useRequest";
import Checkbox from "@/components/checkbox";
import { useSearchParams, useRouter } from "next/navigation";
import { fromMillisToDate, now } from "@/Utils/dates";

let loaded = false;
const Backup = () => {
  const request = useRequest();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [blob, setBlob] = useState(null);
  const [meta, setMeta] = useState(null);
  const [config, setConfig] = useState({
    gdrive: false,
    clientId: "",
    clientSecret: "",
  });

  useEffect(() => {
    if (loaded) return;
    loaded = true;
    loadToken();
    loadOptions();
  }, []);

  const getToken = async () => {
    const redirect = `${document.location.origin}/backup`;
    const url = `https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/drive.file&response_type=code&access_type=offline&redirect_uri=${redirect}&client_id=${config.clientId}`;
    const element = document.createElement("a");
    element.href = url;
    document.body.appendChild(element);
    element.click();
  };

  const loadToken = async () => {
    const token = localStorage.getItem("google-token");
    if (token) return;
    const code = searchParams.get("code");
    if (!code) return;
    const config = localStorage.getItem("configuration");
    if (!config) return;
    const { clientId, clientSecret } = JSON.parse(config);
    const response = await request.corsRequest(
      "POST",
      "https://oauth2.googleapis.com/token",
      {
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${document.location.origin}/backup`,
      }
    );
    if (response.error) return toast.error(response.error_description);
    localStorage.setItem("google-token", JSON.stringify(response));
    router.replace("/backup", undefined, { shallow: true });
  };

  const loadOptions = async () => {
    const config = localStorage.getItem("configuration");
    if (config) setConfig(JSON.parse(config));
  };

  const exportbackup = async () => {
    try {
      const { exportDB } = await import("dexie-export-import");
      const db = await Database("").current.open();
      const blob = await exportDB(db);
      Database("").current.close();
      if (config.gdrive) await exportGoogle(blob);
      else downloadDB(blob);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const exportGoogle = async (blob) => {
    try {
      const googleToken = localStorage.getItem("google-token");
      const configuration = localStorage.getItem("configuration");
      if (!googleToken || !configuration) throw new Error("No token");
      const jsonToken = JSON.parse(googleToken);
      const jsonConfig = JSON.parse(configuration);
      const date = fromMillisToDate(jsonToken["date_expires_in"]).toMillis();
      if (date < now().toMillis()) {
        // REFRESH THE TOKEN
        throw new Error("Expired Token");
      }
      const response = await request.post(
        "api/upload",
        blob,
        {
          mimeType: blob.type,
          client_id: jsonConfig.clientId,
          client_secret: jsonConfig.clientSecret,
          redirect_uri: `${document.location.origin}/backup`,
          refresh_token: jsonToken.refresh_token,
        },
        true
      );
      if (response.error) throw response;
      toast.success(`Synched with id: ${response.id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const downloadDB = (blob) => {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = "database.json";
    document.body.appendChild(element);
    element.click();
  };

  const importbackup = (blob) => setBlob(blob);
  const importbackupgdrive = async () => {
    try {
      const googleToken = localStorage.getItem("google-token");
      const configuration = localStorage.getItem("configuration");
      if (!googleToken || !configuration) throw new Error("No token");
      const jsonToken = JSON.parse(googleToken);
      const jsonConfig = JSON.parse(configuration);
      const response = await request.post(
        "api/download",
        null,
        {
          client_id: jsonConfig.clientId,
          client_secret: jsonConfig.clientSecret,
          redirect_uri: `${document.location.origin}/backup`,
          refresh_token: jsonToken.refresh_token,
        },
        true
      );
      if (response.error) throw response;
      setBlob(new Blob([response.data], { type: "application/json" }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateMeta = async () => {
    if (!blob) return;
    const { peakImportFile } = await import("dexie-export-import");
    const importMeta = await peakImportFile(blob);
    setMeta(importMeta);
  };

  const confirm = async () => {
    try {
      const { importInto } = await import("dexie-export-import");
      const db = await Database("").current;
      await importInto(db, blob, { overwriteValues: true });
      setBlob(null);
      setMeta(null);
      toast.success("Imported~!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    updateMeta();
  }, [blob]);

  const updateConfig = (key, value) => {
    const _config = { ...config, [key]: value };
    setConfig(_config);
    localStorage.setItem("configuration", JSON.stringify(_config));
  };

  return (
    <Page title="Backup and Restore">
      <div className=" mt-4 flex flex-col gap-2">
        <Checkbox
          value={config.gdrive}
          label="Export database to Google Drive"
          onChange={(value) => updateConfig("gdrive", value)}
        />
        {config.gdrive && (
          <>
            <Input
              label="Client Id"
              placeholder="asdfjasdljfasdkjf"
              value={config.clientId}
              onChange={(value) => updateConfig("clientId", value)}
            />
            <Input
              label="Client Secret"
              placeholder="1912308409123890"
              value={config.clientSecret}
              onChange={(value) => updateConfig("clientSecret", value)}
            />
            <Button title="Get Token" onClick={getToken} />

            {localStorage.getItem("google-token") ? (
              <span className="text-green-500">This app has saved token</span>
            ) : (
              <span className="text-red-500">This app dont have token</span>
            )}
          </>
        )}
        <Button title="Export Database" onClick={exportbackup} />
        <Input label="Import Database" type="file" onChange={importbackup} />
        {config.gdrive && (
          <Button
            title="Import Database From GDrive"
            onClick={importbackupgdrive}
          />
        )}
      </div>
      {meta && (
        <div className="mt-2">
          <p className="text-2xl">Database Name: {meta.data.databaseName}</p>
          <p className="text-2xl">
            Database Version: {meta.data.databaseVersion}
          </p>
          <p className="text-xl w-100">Tables: </p>
          <div className="flex gap-2">
            {meta.data.tables.map((table) => (
              <div key={table.name} className="p-2 border rounded-xl">
                <p>Name: {table.name}</p>
                <p>Rows: {table.rowCount}</p>
              </div>
            ))}
          </div>
          <p className="text-xl w-100">Are you sure?</p>
          <Button title="Confirm" onClick={confirm} />
        </div>
      )}
    </Page>
  );
};

export default Backup;
