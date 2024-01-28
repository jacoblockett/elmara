# Elmara

A class-based DOM traversal library akin to Cheerio with a more elegant interface.

> ⚠️ This library is as alpha as alpha gets. Please exercise extreme caution when using this code as there are still plentiful reworks and optimizations to be made, as well as features to be added.

## Installation

```shell
npm i elmara
```

Documentation is coming soon. Most, if not all, classes and their methods should have JSDocs, so understanding and using the library till then shouldn't be too tough. Here's a basic example to get you started in the meantime:

```js
const sample = `<body>
    <h1>title</h1>
    <p>paragraph</p>
    <div id="main" data-custom="1">
        <div class="container">
            <ul>
                <li>blue color</li>
                <li>green</li>
                <li>yellow</li>
            </ul>
        </div>
    </div>
</body>
`

const tree = await elmara(sample)

console.log(tree.select(".container ul li").text) // => ['blue color', 'green', 'yellow']
console.log(tree.selectOne("li", 2).text) // => 'green'
console.log(tree.firstChild.name) // => 'body' (body because the tree is kinda like its own element, so body is technically the first child)
console.log(tree.firstChild.firstChild.name) // => '' (empty because there're newline and space text nodes after the body)
console.log(tree.selectOne("#main").attr) // => { id: 'main', 'data-custom': '1' }
console.log(
	tree
		.select("li")
		.forEach((leaf, i) => {
			leaf.setText(`List item ${i}`) // this can also be leaf.text = `List item ${i}`
		})
		.root.pick(0).markup,
) // => list items will be "List item 0", "List item 1", "List item 2"
```

+ Note: Care has gone into trying to make composition as seamless as possible. When it comes to a tree structure, I believe we should be able to `obj.key.key.key` to our heart's content. As such, most methods, getters, setters should return a Leaf/Bunch instance when it is logical to do so.