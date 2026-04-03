$(".view-btn").on("click", function () {
  const id = $(this).data("id");
  window.location.href = "/blog/" + id;
});

$(".add-card").on("click", function () {
  window.location.href = "/add-blog/" ;
});