"use client";
import React, { useEffect, useState } from "react";
import Page from "@/components/page";
import Button from "@/components/button";
import { exportDB, importInto, peakImportFile } from "dexie-export-import";
import Database from "@/dao/database";
import { toast } from "react-toastify";
import Input from "@/components/input";

const Backup = () => {
  const [blob, setBlob] = useState(null);
  const [meta, setMeta] = useState(null);

  const exportbackup = async () => {
    try {
      const db = await Database("").current.open();
      const blob = await exportDB(db);
      Database("").current.close();
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = "database.json";
      document.body.appendChild(element);
      element.click();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const inportbackup = (blob) => setBlob(blob);

  const updateMeta = async () => {
    if (!blob) return;
    const importMeta = await peakImportFile(blob);
    setMeta(importMeta);
  };

  const confirm = async () => {
    try {
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

  return (
    <Page title="Backup and Restore">
      <div className=" mt-4 flex flex-col gap-2">
        <Button title="Export Database" onClick={exportbackup} />
        <Input label="Import Database" type="file" onChange={inportbackup} />
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
