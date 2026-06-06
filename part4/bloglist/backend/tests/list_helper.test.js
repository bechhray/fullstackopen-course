const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')


describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  const sampleBlogs = [
    {
      title: 'Coconut chicken tenders with spinach and rice',
      author: 'Kerrie Ray',
      url: 'https://www.healthyfood.com/healthy-recipes/coconut-chicken-tenders-with-spinach-and-rice/',
      likes: 0
    },
    {
      title: 'Mushroom and haloumi burgers',
      author: 'Chrissy Freer',
      url: 'https://www.healthyfood.com/healthy-recipes/mushroom-and-haloumi-burgers/',
      likes: 5
    },
    {
      title: 'Warm baked feta and squash salad',
      author: 'HFG staff',
      url: 'https://www.healthyfood.com/healthy-recipes/warm-baked-feta-and-squash-salad/',
      likes: 2
    }
  ]
  test('Total likes when list is empty is zero', () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
  })
  test('Total likes when list is null is zero', () => {
    const blogs = null
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
  })

  test('Total likes when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(sampleBlogs.slice(0, 1))
    assert.strictEqual(result, 0)
  })

  test('Total likes of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(sampleBlogs)
    assert.strictEqual(result, 7)
  })
})

describe('favorite blog', () => {
  const sampleBlogs = [
    {
      title: 'Coconut chicken tenders with spinach and rice',
      author: 'Kerrie Ray',
      url: 'https://www.healthyfood.com/healthy-recipes/coconut-chicken-tenders-with-spinach-and-rice/',
      likes: 0
    },
    {
      title: 'Mushroom and haloumi burgers',
      author: 'Chrissy Freer',
      url: 'https://www.healthyfood.com/healthy-recipes/mushroom-and-haloumi-burgers/',
      likes: 5
    },
    {
      title: 'Warm baked feta and squash salad',
      author: 'HFG staff',
      url: 'https://www.healthyfood.com/healthy-recipes/warm-baked-feta-and-squash-salad/',
      likes: 2
    }
  ]
  test('Favorite blog of an empty list is null', () => {
    const blogs = []
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, null)
  })
  test('Favorite blog of a null list is null', () => {
    const blogs = null
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, null)
  })
  test('Favorite blog of a bigger list is found right', () => {
    const result = listHelper.favoriteBlog(sampleBlogs)
    assert.deepStrictEqual(result, sampleBlogs[1])
  })
  test('Favorite blog of a list with one blog is that blog', () => {
    const result = listHelper.favoriteBlog(sampleBlogs.slice(0, 1))
    assert.deepStrictEqual(result, sampleBlogs[0])
  })
})

describe('most blogs', () => {
  const sampleBlogs = [
    {
      title: 'Coconut chicken tenders with spinach and rice',
      author: 'Kerrie Ray',
      url: 'https://www.healthyfood.com/healthy-recipes/coconut-chicken-tenders-with-spinach-and-rice/',
      likes: 0
    },
    {
      title: 'Mushroom and haloumi burgers',
      author: 'Chrissy Freer',
      url: 'https://www.healthyfood.com/healthy-recipes/mushroom-and-haloumi-burgers/',
      likes: 5
    },
    {
      title: 'Warm baked feta and squash salad',
      author: 'HFG staff',
      url: 'https://www.healthyfood.com/healthy-recipes/warm-baked-feta-and-squash-salad/',
      likes: 2
    },
    {
      title: 'Grilled chicken with avocado salsa',
      author: 'Chrissy Freer',
      url: 'https://www.healthyfood.com/healthy-recipes/grilled-chicken-with-avocado-salsa/',
      likes: 3
    }
  ]
  const sampleBlogsWithTwoAuthorsWithMostBlogs = [
    ...sampleBlogs,
    {
      title: 'Couscous salad with chickpeas and feta',
      author: 'Kerrie Ray',
      url: 'https://www.healthyfood.com/healthy-recipes/couscous-salad-with-chickpeas-and-feta/',
      likes: 1
    }
  ]
  test('Author with most blogs of an empty list is null', () => {
    const blogs = []
    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result, null)
  })
  test('Author with most blogs of a null list is null', () => {
    const blogs = null
    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result, null)
  })
  test('Author with most blogs of a bigger list is found right', () => {
    const result = listHelper.mostBlogs(sampleBlogs)
    assert.deepStrictEqual(result, { author: 'Chrissy Freer', blogs: 2 })
  })
  test('Author with most blogs of a list with one blog is the author of that blog', () => {
    const result = listHelper.mostBlogs(sampleBlogs.slice(0, 1))
    assert.deepStrictEqual(result, { author: 'Kerrie Ray', blogs: 1 })
  })
  test('Author with most blogs of a list with two authors with the same amount of blogs returns any one of them', () => {
    const validResults = [
      { author: 'Chrissy Freer', blogs: 2 },
      { author: 'Kerrie Ray', blogs: 2 }
    ]
    const result = listHelper.mostBlogs(sampleBlogsWithTwoAuthorsWithMostBlogs)
    const isValid = validResults.some(valid =>
      JSON.stringify(valid) === JSON.stringify(result)
    )
    assert.strictEqual(isValid, true)
  })
})

describe('most likes', () => {
  const sampleBlogs = [
    {
      title: 'Coconut chicken tenders with spinach and rice',
      author: 'Kerrie Ray',
      url: 'https://www.healthyfood.com/healthy-recipes/coconut-chicken-tenders-with-spinach-and-rice/',
      likes: 2
    },
    {
      title: 'Mushroom and haloumi burgers',
      author: 'Chrissy Freer',
      url: 'https://www.healthyfood.com/healthy-recipes/mushroom-and-haloumi-burgers/',
      likes: 5
    },
    {
      title: 'Warm baked feta and squash salad',
      author: 'HFG staff',
      url: 'https://www.healthyfood.com/healthy-recipes/warm-baked-feta-and-squash-salad/',
      likes: 9
    },
    {
      title: 'Grilled chicken with avocado salsa',
      author: 'Chrissy Freer',
      url: 'https://www.healthyfood.com/healthy-recipes/grilled-chicken-with-avocado-salsa/',
      likes: 3
    }
  ]
  const sampleBlogsWithTwoAuthorsWithMostLikes = [
    ...sampleBlogs,
    {
      title: 'Couscous salad with chickpeas and feta',
      author: 'Chrissy Freer',
      url: 'https://www.healthyfood.com/healthy-recipes/couscous-salad-with-chickpeas-and-feta/',
      likes: 1
    }
  ]
  test('Author with most likes of an empty list is null', () => {
    const blogs = []
    const result = listHelper.mostLikes(blogs)
    assert.strictEqual(result, null)
  })
  test('Author with most likes of a null list is null', () => {
    const blogs = null
    const result = listHelper.mostLikes(blogs)
    assert.strictEqual(result, null)
  })
  test('Author with most likes of a bigger list is found right', () => {
    const result = listHelper.mostLikes(sampleBlogs)
    assert.deepStrictEqual(result, { author: 'HFG staff', likes: 9 })
  })
  test('Author with most likes of a list with one blog is the author of that blog and the likes of that blog', () => {
    const result = listHelper.mostLikes(sampleBlogs.slice(0, 1))
    assert.deepStrictEqual(result, { author: 'Kerrie Ray', likes: 2 })
  })
  test('Author with most likes of a list with two authors with the same likes returns any one of them', () => {
    const validResults = [
      { author: 'Chrissy Freer', likes: 9 },
      { author: 'HFG staff', likes: 9 }
    ]
    const result = listHelper.mostLikes(sampleBlogsWithTwoAuthorsWithMostLikes)
    const isValid = validResults.some(valid =>
      JSON.stringify(valid) === JSON.stringify(result)
    )
    assert.strictEqual(isValid, true)
  })
})