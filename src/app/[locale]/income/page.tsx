"use client";
import Button from "@/components/button";
import Group from "@/components/group";
import { HeaderChange } from "@/components/header";
import Input, { InputType } from "@/components/input";
import Page from "@/components/page";
import Table from "@/components/table";
import { Income } from "@/contexts/DatabaseContext";
import useDatabase from "@/hooks/useDatabase";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const IncomePage = () => {
  const t = useTranslations("income");
  const database = useDatabase();

  const [income, setIncome] = useState<Income[]>([]);
  const [description, setDescription] = useState({ value: "", error: true });
  const [value, setValue] = useState({ value: "", error: true });
  const [date, setDate] = useState({ value: "", error: true });

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async (order?: HeaderChange) => {
    try {
      const all = await database.income.getAll(order);
      setIncome(all);
    } catch (error) {
      const obj = error as Error;
      toast.error(obj.message);
    }
  };

  const updateIncome = async ({ id, description, value, date }: Income) => {
    try {
      if (!description.trim())
        throw new Error(t("msg_empty_income_description"));
      if (!value) throw new Error(t("msg_empty_income_value"));
      if (!date) throw new Error(t("msg_empty_income_date"));

      await database.income.update(id, description, value, Number(date));
      onLoad();
      toast.success(t("msg_updated_success"));
    } catch (error) {
      const obj = error as Error;
      toast.error(`${t("msg_update_error")}.\n${obj.message}`);
    } finally {
      onLoad();
    }
  };

  const deleteIncome = async ({ id }: Income) => {
    try {
      await database.income.delete(id);
      onLoad();
      toast.success(t("msg_deleted_success"));
    } catch (error) {
      const obj = error as Error;
      toast.error(`${t("msg_deleted_failed")}.\n${obj.message}`);
    } finally {
      onLoad();
    }
  };

  const insertIncome = async () => {
    try {
      if (description.error) throw new Error(t("msg_empty_income_description"));
      if (value.error) throw new Error(t("msg_empty_income_value"));
      if (date.error) throw new Error(t("msg_empty_income_date"));

      await database.income.insert(
        description.value.trim(),
        Number(value.value),
        Number(date.value)
      );
      onLoad();
      toast.success(t("msg_insert_success"));
    } catch (error) {
      const obj = error as Error;
      toast.error(`${t("msg_insert_error")}.\n${obj.message}`);
    }
  };

  return (
    <Page title={t("title")}>
      <Group title={t("group_new_title")}>
        <Input
          label={t("input_description")}
          onChange={(value) => {
            if (value == null || value instanceof File) return;
            const description = value.toString();
            setDescription({ value: description, error: !description.trim() });
          }}
          value={description.value}
          error={description.error}
        />
        <Input
          label={t("input_value")}
          type={InputType.MONEY}
          onChange={(value) => {
            if (value == null || value instanceof File) return;
            const newValue = value.toString().trim();
            setValue({ value: newValue, error: !newValue });
          }}
          value={value.value}
          error={value.error}
        />
        <Input
          label={t("input_date")}
          type={InputType.DATETIME_LOCAL}
          onChange={(value) => {
            if (value == null || value instanceof File) return;
            console.log(">>>date", value);
            setDate({ error: !value, value: value.toString() });
          }}
          value={date.value}
          error={date.error}
        />
        <Button onClick={insertIncome} title={t("button_new")} />
      </Group>
      <Table<Income>
        list={income}
        model={[
          {
            key: "id",
            type: InputType.NUMBER,
            readonly: true,
          },
          {
            key: "description",
            type: InputType.DEFAULT,
            readonly: false,
          },
          {
            key: "value",
            type: InputType.MONEY,
            readonly: false,
          },
          {
            key: "date",
            type: InputType.DATETIME_LOCAL,
            readonly: false,
          },
        ]}
        onChange={updateIncome}
        onChangeOrder={onLoad}
        onDelete={deleteIncome}
      />
    </Page>
  );
};

export default IncomePage;
