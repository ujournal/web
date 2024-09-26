---
title: Колекції стрічок
---

<div class="box">
  <div class="box-header">
    <div class="box-header-start"></div>
    <div class="box-title">{{page.title}}</div>
    <div class="box-header-end">
      <a href="#" class="button">
        {% svg icons/plus.svg %}
      </a>
    </div>
  </div>

  <form class="search">
    {% svg icons/search.svg %}
    <input class="search-input" type="search" placeholder="Шукати колекцію" />
  </form>

  <nav class="list">
    {% include list_item.html name='Стрічки про Київ' %}
    {% include list_item.html name='Тематичні стрічки' %}
    {% include list_item.html name='Користувацькі стрічки' %}
    {% include list_item.html name='Відео-стрічки з YouTube' %}
    {% include list_item.html name='Аудіо-стрічки з SoundCloud' %}
    {% include list_item.html name='Новинні стрічки про Україну' %}
    {% include list_item.html name='Новинні стрічки про Америку' %}
    {% include list_item.html name='Новинні стрічки про Польщу' %}
    {% include list_item.html name='Стрічки про Одесу' %}
    {% include list_item.html name='Стрічки про Житомир' %}
    {% include list_item.html name='Стрічки про Львів' %}
  </nav>
</div>
