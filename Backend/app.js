import Express from "express";
import fs from "fs";
import cors from "cors";

const app = Express();

app.use(cors());

app.use(Express.json());

const getItems = () => {
  try {
    const items = fs.readFileSync("./db.json", "utf-8");
    return JSON.parse(items);
  } catch (err) {
    console.log(err);
  }
};

const saveItems = (items) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(items));
  } catch (err) {
    console.log(err);
  }
};

app.get("/items", (req, res) => {
  const data = getItems();
  if (data.items.length > 0) {
    res.json(data.items);
  } else {
    res.json({ message: "No items found" });
  }
});

app.post("/items", (req, res) => {
  const data = getItems();
  const newItem = { ...req.body };
  data.items.push(newItem);
  saveItems(data);
  res.json(newItem);
});

app.put("/items/:id", (req, res) => {
  const data = getItems();
  const id = parseInt(req.params.id);
  const itemIndex = data.items.findIndex((item) => item.id === id);

  if (itemIndex !== -1) {
    data.items[itemIndex] = { ...data.items[itemIndex], ...req.body };
    saveItems(data);
    res.json({ message: "Item updated successfully" });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

app.delete("/items/:id", (req, res) => {
  const data = getItems();
  const id = parseInt(req.params.id);
  const itemIndex = data.items.findIndex((item) => item.id === id);

  if (itemIndex !== -1) {
    data.items.splice(itemIndex, 1);
    saveItems(data);
    res.json({ message: "Item deleted successfully" });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

const PORT = 3000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
