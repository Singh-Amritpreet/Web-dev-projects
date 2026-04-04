$(".view-btn").on("click", function () {
  const id = $(this).data("id");
  window.location.href = "/blog/" + id;
});

$(".edit-btn").on("click", function () {
  const id = $(this).data("id");
  window.location.href = "/edit-blog/" + id;
});

$(".add-card button").on("click", function () {
  window.location.href = "/add-blog/" ;
});