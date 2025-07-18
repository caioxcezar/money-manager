"use client";
import React, { useEffect, useMemo, useState } from "react";
import Page from "@/components/page";
import Button from "@/components/button";
import Database from "@/dao/database";
import { toast } from "react-toastify";
import Input from "@/components/input";
import useRequest from "@/hooks/useRequest";
import Checkbox from "@/components/checkbox";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const Backup = () => {
  const t = useTranslations("backup");
  const request = useRequest();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [blob, setBlob] = useState(null);
  const [meta, setMeta] = useState(null);
  const [hasServer, setHasServer] = useState(false);
  const [config, setConfig] = useState({
    gdrive: false,
    clientId: "",
    clientSecret: "",
  });

  useEffect(() => {
    checkServer();
    loadToken();
    loadOptions();
  }, []);

  const uri = () => {
    const url = document.URL;
    const params = url.indexOf("/backup");
    if (params == -1) return url;
    return url.substring(0, params);
  };

  const redirectUri = () => `${uri()}/backup`;

  const checkServer = async () =>
    request
      .post("/api/ping")
      .then(() => setHasServer(true))
      .catch(() => setHasServer(false));

  const getToken = async () => {
    const url = `https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/drive.file&response_type=code&access_type=offline&redirect_uri=${redirectUri()}&client_id=${
      config.clientId
    }`;
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
        redirect_uri: redirectUri(),
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
      if (gdrive) await exportGoogle(blob);
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
      const response = await request.post(
        "/api/upload",
        blob,
        {
          mimeType: blob.type,
          client_id: jsonConfig.clientId,
          client_secret: jsonConfig.clientSecret,
          redirect_uri: redirectUri(),
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
        "/api/download",
        null,
        {
          client_id: jsonConfig.clientId,
          client_secret: jsonConfig.clientSecret,
          redirect_uri: redirectUri(),
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

  const gdrive = useMemo(() => config.gdrive && hasServer, [config, hasServer]);

  return (
    <Page title={t("title")}>
      <div className=" mt-4 flex flex-col gap-2">
        {hasServer ? (
          <Checkbox
            value={config.gdrive}
            label={t("checkbox_gdrive")}
            onChange={(value) => updateConfig("gdrive", value)}
          />
        ) : (
          <div className="text-red-500">{t("gdrive_missing_alert")}</div>
        )}
        {gdrive && (
          <>
            <Input
              label={t("input_client_id")}
              placeholder="asdfjasdljfasdkjf"
              value={config.clientId}
              onChange={(value) => updateConfig("clientId", value)}
            />
            <Input
              label={t("input_client_secret")}
              placeholder="1912308409123890"
              value={config.clientSecret}
              onChange={(value) => updateConfig("clientSecret", value)}
            />
            <Button title={t("button_token")} onClick={getToken} />

            {localStorage.getItem("google-token") ? (
              <span className="text-green-500">{t("msg_has_saved_token")}</span>
            ) : (
              <span className="text-red-500">
                {t("msg_dont_have_saved_token")}
              </span>
            )}
          </>
        )}
        <Button title={t("button_export")} onClick={exportbackup} />
        <Input label={t("button_import")} type="file" onChange={importbackup} />
        {gdrive && (
          <Button
            title={t("button_gdrive_import")}
            onClick={importbackupgdrive}
          />
        )}
      </div>
      {meta && (
        <div className="mt-2">
          <p className="text-2xl">
            {t("msg_db_name")}: {meta.data.databaseName}
          </p>
          <p className="text-2xl">
            {t("msg_db_version")}: {meta.data.databaseVersion}
          </p>
          <p className="text-xl w-100">{t("msg_db_tables")}: </p>
          <div className="flex gap-2">
            {meta.data.tables.map((table) => (
              <div key={table.name} className="p-2 border rounded-xl">
                <p>
                  {t("msg_tb_name")}: {table.name}
                </p>
                <p>
                  {t("msg_tb_rows")}: {table.rowCount}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xl w-100">{t("msg_confirm")}</p>
          <Button title={t("button_confirm")} onClick={confirm} />
        </div>
      )}
    </Page>
  );
};

export default Backup;
