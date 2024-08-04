"use client";
import Button from "@/components/button";
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

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async (order) => {
    try {
      const all = order
        ? await CategoryDao.getRange(order)
        : await CategoryDao.getAll();
      setCategories(all);
    } catch (error) {
      toast.error(error);
    }
  };

  const updateCategory = async ({ id, description }) => {
    try {
      await CategoryDao.update(id, description);
      onLoad();
      toast.success("Updated successfully");
    } catch (error) {
      toast.error("Error while updateding");
    } finally {
      onLoad();
    }
  };

  const deleteCategory = async ({ id }) => {
    try {
      const expense = await ExpenseDao.getOneByCategory(id);
      if (expense) return toast.error("Cannot delete, category is in use");
      await CategoryDao.delete(id);
      onLoad();
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Error while deleting");
    } finally {
      onLoad();
    }
  };

  return (
    <Page title="Categories">
      <div className="border m-2 rounded-lg p-2">
        <span className="text-2xl">Create New</span>
        <Input
          label={"Category name"}
          onChange={setCategoryName}
          value={categoryName}
        />
        <Button
          onClick={() =>
            CategoryDao.insert(categoryName)
              .then(() => {
                onLoad();
                toast.success("Sucesso~!");
              })
              .catch((err) => {
                console.error(err);
                toast.error("Unable to save");
              })
          }
          title="Create new"
        />
      </div>
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
