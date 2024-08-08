"use client";
import Button from "@/components/button";
import Group from "@/components/group";
import Input from "@/components/input";
import Page from "@/components/page";
import Table from "@/components/table";
import CategoryDao from "@/dao/category";
import ExpenseDao from "@/dao/expense";
import category from "@/models/category";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async (order) => {
    try {
      const all = await CategoryDao.getAll(order);
      setCategories(all);
    } catch (error) {
      toast.error(error);
    }
  };

  const updateCategory = async ({ id, description }) => {
    try {
      if (!description.trim()) throw new Error("Category must have a name");
      await CategoryDao.update(id, description);
      onLoad();
      toast.success("Updated successfully");
    } catch (error) {
      toast.error(`Error while updateding.\n${error.message}`);
    } finally {
      onLoad();
    }
  };

  const deleteCategory = async ({ id }) => {
    try {
      const expense = await ExpenseDao.countBy("category", id);
      if (expense) throw new Error("Cannot delete, category is in use");
      await CategoryDao.delete(id);
      onLoad();
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error(`Unable to delete.\n${error.message}`);
    } finally {
      onLoad();
    }
  };

  const insertCategory = async () => {
    try {
      if (categoryError) throw new Error("Category must have a name");
      await CategoryDao.insert(categoryName);
      onLoad();
      toast.success("Sucesso~!");
    } catch (error) {
      toast.error(`Unable to save.\n${error.message}`);
    }
  };

  return (
    <Page title="Categories">
      <Group title="Create New">
        <Input
          label={"Category name"}
          onChange={(value) => {
            setCategoryName(value);
            setCategoryError(!value.trim());
          }}
          value={categoryName}
          error={categoryError}
        />
        <Button onClick={insertCategory} title="Create new" />
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
