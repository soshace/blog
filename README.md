Soshace.com
====

Особенности:
<ul>
    <li>
        Отрисовка шаблонов происходит как на клиенте, так и на сервере. (дублирует)
        <ul>
            <li>
                Отрисовка шаблона на сервере проиходит только при первой отдаче.
            </li>
            <li>
                Используется общий каталог с шаблонами app/views
            </li>
        </ul>
    </li>
    <li>
        Роутинг проиходит как на клиенте так и на сервере (дублирует)
        <ul>
            <li>При индексировании страниц поисковым пауком должен отрабатывать серверный роутинг</li>
            <li>При неполной загрузки скриптов должен отрабатывать серверный роутинг</li>
            <li>В браузерах без поддержки History API должен отрабатывать сервеный роутинг</li>
        </ul>
    </li>
    <li>
        Собранная статика хранится в папке dist
        <ul>
            <li>
                Статика на клиент отдается по урлу /static/ nginx'ом
            </li>
        </ul>
    </li>
    <li>
        API отдает сообщения на английском языке, за исключением данных из базы
        <ul>
            <li>
                Отрендеренные шаблоны с сервера передаются с переводом, т.к. хелперы перевода встроены в шаблон
            </li>
            <li>
                Перевод ответов API осуществляется на клиенте, т.к. на клиенте мы в любом месте (модель, вид,
                вспомогательные
                модули) можем
                легко использовать методы перевода в отличии от серера, где нужно пробрасывать объект request
            </li>
        </ul>
    </li>

</ul>

Network for professionals [Soshace](https://soshace.com)
