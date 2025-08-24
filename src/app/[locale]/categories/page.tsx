"use client";
import Button from "@/components/button";
import Group from "@/components/group";
import { HeaderChange } from "@/components/header";
import Input, { InputType } from "@/components/input";
import Page from "@/components/page";
import Table from "@/components/table";
import { Category } from "@/contexts/DatabaseContext";
import useDatabase from "@/hooks/useDatabase";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Categories = () => {
  const t = useTranslations("categories");
  const database = useDatabase();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async (order?: HeaderChange) => {
    try {
      const all = await database.categories.getAll(order);
      setCategories(all);
    } catch (error) {
      const obj = error as Error;
      toast.error(obj.message);
    }
  };

  const updateCategory = async ({ id, description }: Category) => {
    try {
      if (!description.trim()) throw new Error(t("msg_empty_category"));
      await database.categories.update(id, description);
      onLoad();
      toast.success(t("msg_updated_success"));
    } catch (error) {
      const obj = error as Error;
      toast.error(`${t("msg_update_error")}.\n${obj.message}`);
    } finally {
      onLoad();
    }
  };

  const deleteCategory = async ({ id }: Category) => {
    try {
      const expense = await database.expenses.countBy("category", id);
      if (expense) throw new Error(t("msg_not_empty_category"));
      await database.categories.delete(id);
      onLoad();
      toast.success(t("msg_deleted_success"));
    } catch (error) {
      const obj = error as Error;
      toast.error(`${t("msg_deleted_failed")}.\n${obj.message}`);
    } finally {
      onLoad();
    }
  };

  const insertCategory = async () => {
    try {
      if (categoryError) throw new Error(t("msg_empty_category"));
      await database.categories.insert(categoryName);
      onLoad();
      toast.success(t("msg_insert_success"));
    } catch (error) {
      const obj = error as Error;
      toast.error(`${"msg_insert_error"}.\n${obj.message}`);
    }
  };

  return (
    <Page title={t("title")}>
      <Group title={t("group_new_title")}>
        <Input
          label={t("input_category")}
          onChange={(value) => {
            if (value == null || value instanceof File) return;
            const category = value.toString().trim();
            setCategoryName(category);
            setCategoryError(!value);
          }}
          value={categoryName}
          error={categoryError}
        />
        <Button onClick={insertCategory} title={t("button_new")} />
      </Group>
      <Table<Category>
        list={categories}
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
        ]}
        onChange={updateCategory}
        onChangeOrder={onLoad}
        onDelete={deleteCategory}
      />
    </Page>
  );
};

export default Categories;
