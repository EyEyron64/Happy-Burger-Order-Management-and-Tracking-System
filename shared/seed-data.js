function seedMenuIfEmpty() {
  const existing = Storage.getMenuItems();
  if (existing.length > 0) return;

  const defaults = [
    createMenuItem({
      name: "Classic Cheeseburger",
      description: "Beef patty, cheddar, lettuce, tomato, house sauce.",
      price: 6.5,
      category: "Burgers",
      image: "assets/images/classic-cheeseburger.jpg",
    }),
    createMenuItem({
      name: "Double Bacon Stack",
      description: "Two patties, bacon, cheddar, caramelized onions.",
      price: 9.0,
      category: "Burgers",
      image: "assets/images/double-bacon.jpg",
    }),
    createMenuItem({
      name: "Veggie Burger",
      description: "Grilled plant-based patty, avocado, sprouts.",
      price: 7.5,
      category: "Burgers",
      image: "assets/images/veggie-burger.jpg",
    }),
    createMenuItem({
      name: "Crispy Fries",
      description: "Golden fries, lightly salted.",
      price: 3.0,
      category: "Sides",
      image: "assets/images/fries.jpg",
    }),
    createMenuItem({
      name: "Onion Rings",
      description: "Beer-battered, crispy fried.",
      price: 3.5,
      category: "Sides",
      image: "assets/images/onion-rings.jpg",
    }),
    createMenuItem({
      name: "Chocolate Shake",
      description: "Thick, creamy, topped with whipped cream.",
      price: 4.5,
      category: "Drinks",
      image: "assets/images/choc-shake.jpg",
    }),
    createMenuItem({
      name: "Soda",
      description: "Cola, lemon-lime, or root beer.",
      price: 2.0,
      category: "Drinks",
      image: "assets/images/soda.jpg",
    }),
  ];

  Storage.saveMenuItems(defaults);
}
