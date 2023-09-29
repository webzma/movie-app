// data
const api = axios.create({
	baseURL: 'https://api.themoviedb.org/3/',
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
	params: {
		api_key: API_KEY,
		language: navigator.language,
	},
})

let observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const urlImg = entry.target.getAttribute('data-img')
			entry.target.setAttribute('src', urlImg)
		}
	})
})

function likedMovieList() {
	let item

	localStorage.getItem('liked_movies_V1')
		? (item = JSON.parse(localStorage.getItem('liked_movies_V1')))
		: (item = {})

	return item
}

function likedMovie(movie) {
	let likedMovies = likedMovieList()

	console.log(likedMovies)

	if (likedMovies[movie.id]) {
		likedMovies[movie.id] = undefined
	} else {
		likedMovies[movie.id] = movie
	}

	return localStorage.setItem('liked_movies_V1', JSON.stringify(likedMovies))
}

// utils
function createMovies(movies, container, lazy = false, clean = true) {
	if (clean) container.innerHTML = ''

	movies.forEach((movie) => {
		const movieContainer = document.createElement('div')
		movieContainer.classList.add('movie-container')
		movieContainer.addEventListener('click', () => {
			location.hash = '#movie=' + movie.id
		})

		const movieImg = document.createElement('img')
		movieImg.classList.add('movie-img')
		movieImg.setAttribute('alt', movie.title)
		movieImg.setAttribute(
			lazy ? 'data-img' : 'src',
			'https://image.tmdb.org/t/p/w300' + movie.poster_path
		)

		movieImg.addEventListener('error', () => {
			movieImg.setAttribute(
				'src',
				'https://static.platzi.com/static/images/error/img404.png'
			)
		})

		const movieBtn = document.createElement('button')
		if (likedMovieList()[movie.id]) movieBtn.classList.add('movie-btn--liked')
		movieBtn.classList.add('movie-btn')

		movieBtn.addEventListener('click', (e) => {
			movieBtn.classList.toggle('movie-btn--liked')
			e.stopPropagation()

			likedMovie(movie)
			getLikedMovies()
		})

		if (lazy) {
			observer.observe(movieImg)
		}

		movieContainer.appendChild(movieImg)
		movieContainer.appendChild(movieBtn)
		container.appendChild(movieContainer)
	})
}

function createCategories(categories, container) {
	container.innerHTML = ''

	categories.forEach((category) => {
		const categoryContainer = document.createElement('div')
		categoryContainer.classList.add('category-container')

		const categoryTitle = document.createElement('h3')
		categoryTitle.classList.add('category-title')
		categoryTitle.setAttribute('id', 'id' + category.id)
		categoryTitle.addEventListener('click', () => {
			location.hash = `#category=${category.id}-${category.name}`
		})
		const categoryTitleText = document.createTextNode(category.name)

		categoryTitle.appendChild(categoryTitleText)
		categoryContainer.appendChild(categoryTitle)
		container.appendChild(categoryContainer)
	})
}

async function getTrendingMoviesPreview() {
	const { data } = await api('trending/movie/day')
	const movies = data.results

	createMovies(movies, trendingMoviesPreviewList, true)
}

async function getCategegoriesPreview() {
	const { data } = await api('genre/movie/list')
	const categories = data.genres

	createCategories(categories, categoriesPreviewList)
}

async function getMoviesByCategory(id) {
	const { data } = await api('discover/movie', {
		params: {
			with_genres: id,
		},
	})
	const movies = data.results
	maxPages = data.total_pages

	createMovies(movies, genericSection, true)
}

function getPaginatedMoviesByCategory(id) {
	return async () => {
		const { clientHeight, scrollTop, scrollHeight } = document.documentElement
		const scrollIsBotttom = clientHeight + scrollTop >= scrollHeight
		const isMaxPage = pageNumber >= maxPages

		if (isMaxPage) return

		if (scrollIsBotttom) {
			console.log('true')
			const { data } = await api('discover/movie', {
				params: {
					with_genres: id,
					page: pageNumber++,
				},
			})
			const movies = data.results
			createMovies(movies, genericSection, true, false)
		}
	}
}

async function getMoviesBySearch(query) {
	const { data } = await api('search/movie', {
		params: {
			query,
		},
	})
	maxPages = data.total_pages
	const movies = data.results

	createMovies(movies, genericSection)
}

function getPaginatedMoviesBySearch(query) {
	return async () => {
		const { clientHeight, scrollTop, scrollHeight } = document.documentElement

		const scrollIsBotttom = clientHeight + scrollTop >= scrollHeight
		const isMaxPage = pageNumber >= maxPages

		if (isMaxPage) return

		if (scrollIsBotttom) {
			const { data } = await api('search/movie', {
				params: {
					query,
					page: pageNumber++,
				},
			})
			const movies = data.results
			createMovies(movies, genericSection, true, false)
		}
	}
}

async function getTrendingMovies() {
	const { data } = await api('trending/movie/day')
	maxPages = data.total_pages

	const movies = data.results
	createMovies(movies, genericSection, true)
}

async function getPaginatedTrendingMovies() {
	const { clientHeight, scrollTop, scrollHeight } = document.documentElement

	const scrollIsBotttom = clientHeight + scrollTop >= scrollHeight
	const isMaxPage = pageNumber >= maxPages

	if (isMaxPage) return

	if (scrollIsBotttom && location.hash == '#trends') {
		console.log('true');
		const { data } = await api('trending/movie/day', {
			params: {
				page: pageNumber++,
			},
		})
		const movies = data.results
		createMovies(movies, genericSection, true, false)
	}
}

async function getMovieById(id) {
	const { data: movie } = await api('movie/' + id)

	const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path
	headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})
  `

	movieDetailTitle.textContent = movie.title
	movieDetailDescription.textContent = movie.overview
	movieDetailScore.textContent = movie.vote_average

	createCategories(movie.genres, movieDetailCategoriesList)

	getRelatedMoviesId(id)
}

async function getRelatedMoviesId(id) {
	const { data } = await api(`movie/${id}/recommendations`)
	const relatedMovies = data.results

	createMovies(relatedMovies, relatedMoviesContainer)
}

function getLikedMovies() {
	const likedMovies = likedMovieList()
	const likedMovieArray = Object.values(likedMovies)

	createMovies(likedMovieArray, likedMovieListContainer, false, true)
}
