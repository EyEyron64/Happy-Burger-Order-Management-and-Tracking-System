function seedMenuIfEmpty() {
  const existing = Storage.getMenuItems();
  if (existing.length > 0) return;

  const defaults = [
    createMenuItem({
      name: "Classic Burger",
      description: "Two smashed angus beef patties, double American cheese, house pickles, crisp iceberg, and signature sauce on a toasted brioche bun.",
      price: 50,
      image: "assets/images/classic-burger.jpg",
    }),
    createMenuItem({
      name: "Double Bacon Stack",
      description: "Two patties, bacon, cheddar, caramelized onions.",
      price: 90,
      image: "assets/images/double-bacon.jpg",
    }),
    createMenuItem({
      name: "Veggie Burger",
      description: "Grilled plant-based patty, avocado, sprouts.",
      price: 75,
      image: "assets/images/veggie-burger.jpg",
    }),
    createMenuItem({
      name: "Crispy Fries",
      description: "Golden fries, lightly salted.",
      price: 30,
      image: "assets/images/fries.jpg",
    }),
    createMenuItem({
      name: "Chocolate Shake",
      description: "Thick, creamy, topped with whipped cream.",
      price: 45,
      image: "assets/images/choc-shake.jpg",
    }),
  ];

  Storage.saveMenuItems(defaults);
}