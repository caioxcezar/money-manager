"use client";
import Button from "@/components/button";
import Group from "@/components/group";
import Input from "@/components/input";
import Page from "@/components/page";
import Table from "@/components/table";
import useDatabase from "@/hooks/useDatabase";
import category from "@/models/category";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Categories = () => {
  const t = useTranslations("categories");
  const database = useDatabase();

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async (order) => {
    try {
      const all = await database.categories.getAll(order);
      setCategories(all);
    } catch (error) {
      toast.error(error);
    }
  };

  const updateCategory = async ({ id, description }) => {
    try {
      if (!description.trim()) throw new Error(t("msg_empty_category"));
      await database.categories.update(id, description);
      onLoad();
      toast.success(t("msg_updated_success"));
    } catch (error) {
      toast.error(`${t("msg_update_error")}.\n${error.message}`);
    } finally {
      onLoad();
    }
  };

  const deleteCategory = async ({ id }) => {
    try {
      const expense = await database.expenses.countBy("category", id);
      if (expense) throw new Error(t("msg_not_empty_category"));
      await database.categories.delete(id);
      onLoad();
      toast.success(t("msg_deleted_success"));
    } catch (error) {
      toast.error(`${t("msg_deleted_failed")}.\n${error.message}`);
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
      toast.error(`${"msg_insert_error"}.\n${error.message}`);
    }
  };

  return (
    <Page title={t("title")}>
      <Group title={t("group_new_title")}>
        <Input
          label={t("input_category")}
          onChange={(value) => {
            setCategoryName(value);
            setCategoryError(!value.trim());
          }}
          value={categoryName}
          error={categoryError}
        />
        <Button onClick={insertCategory} title={t("button_new")} />
      </Group>
      <Table
        list={categories}
        model={category}
        onChange={updateCategory}
        onChangeOrder={onLoad}
        onDelete={deleteCategory}
      />
    </Page>
  );
};

export default Categories;
