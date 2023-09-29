let pageNumber = 2
let infiniteScroll
let maxPages

window.addEventListener('DOMContentLoaded', navigator, false)
window.addEventListener('hashchange', navigator, false)
window.addEventListener('scroll', infiniteScroll, false)

searchFormBtn.addEventListener('click', () => {
	location.hash = '#search=' + searchFormInput.value
})

trendingBtn.addEventListener('click', () => {
	location.hash = '#trends'
})

arrowBtn.addEventListener('click', () => {
	history.back()
	// location.hash = '#home';
})

function navigator() {
	if (infiniteScroll) {
		window.removeEventListener('scroll', infiniteScroll, {
			pasive: true,
		})
		infiniteScroll = undefined
	}

	if (location.hash.startsWith('#trends')) {
		trendsPage()
	} else if (location.hash.startsWith('#search=')) {
		searchPage()
	} else if (location.hash.startsWith('#movie=')) {
		movieDetailsPage()
	} else if (location.hash.startsWith('#category=')) {
		categoriesPage()
	} else {
		homePage()
	}

	document.body.scrollTop = 0
	document.documentElement.scrollTop = 0

	if (infiniteScroll) {
		window.addEventListener('scroll', infiniteScroll, false)
	}
}

function homePage() {
	headerSection.classList.remove('header-container--long')
	headerSection.style.background = ''
	arrowBtn.classList.add('inactive')
	arrowBtn.classList.remove('header-arrow--white')
	headerTitle.classList.remove('inactive')
	headerCategoryTitle.classList.add('inactive')
	searchForm.classList.remove('inactive')

	trendingPreviewSection.classList.remove('inactive')
	categoriesPreviewSection.classList.remove('inactive')
	genericSection.classList.add('inactive')
	movieDetailSection.classList.add('inactive')
	likedMoviesSection.classList.remove('inactive')

	getTrendingMoviesPreview()
	getCategegoriesPreview()
	getLikedMovies()
}
function categoriesPage() {
	headerSection.classList.remove('header-container--long')
	headerSection.style.background = ''
	arrowBtn.classList.remove('inactive')
	arrowBtn.classList.remove('header-arrow--white')
	headerTitle.classList.add('inactive')
	headerCategoryTitle.classList.remove('inactive')
	searchForm.classList.add('inactive')

	trendingPreviewSection.classList.add('inactive')
	categoriesPreviewSection.classList.add('inactive')
	genericSection.classList.remove('inactive')
	movieDetailSection.classList.add('inactive')
	likedMoviesSection.classList.add('inactive')

	// ['#category', 'id-name']
	const [_, categoryData] = location.hash.split('=')
	const [categoryId, categoryName] = categoryData.split('-')

	headerCategoryTitle.innerHTML = categoryName

	getMoviesByCategory(categoryId)
	infiniteScroll = getPaginatedMoviesByCategory(categoryId)
}

function movieDetailsPage() {
	headerSection.classList.add('header-container--long')
	// headerSection.style.background = '';
	arrowBtn.classList.remove('inactive')
	arrowBtn.classList.add('header-arrow--white')
	headerTitle.classList.add('inactive')
	headerCategoryTitle.classList.add('inactive')
	searchForm.classList.add('inactive')

	trendingPreviewSection.classList.add('inactive')
	categoriesPreviewSection.classList.add('inactive')
	genericSection.classList.add('inactive')
	movieDetailSection.classList.remove('inactive')
	likedMoviesSection.classList.add('inactive')

	// ['#movie', '234567']
	const [_, movieId] = location.hash.split('=')
	getMovieById(movieId)
}

function searchPage() {
	headerSection.classList.remove('header-container--long')
	headerSection.style.background = ''
	arrowBtn.classList.remove('inactive')
	arrowBtn.classList.remove('header-arrow--white')
	headerTitle.classList.add('inactive')
	headerCategoryTitle.classList.add('inactive')
	searchForm.classList.remove('inactive')

	trendingPreviewSection.classList.add('inactive')
	categoriesPreviewSection.classList.add('inactive')
	genericSection.classList.remove('inactive')
	movieDetailSection.classList.add('inactive')
	likedMoviesSection.classList.add('inactive')

	// ['#search', 'platzi']
	const [_, query] = location.hash.split('=')
	getMoviesBySearch(query)

	infiniteScroll = getPaginatedMoviesBySearch(query)
}

function trendsPage() {
	headerSection.classList.remove('header-container--long')
	headerSection.style.background = ''
	arrowBtn.classList.remove('inactive')
	arrowBtn.classList.remove('header-arrow--white')
	headerTitle.classList.add('inactive')
	headerCategoryTitle.classList.remove('inactive')
	searchForm.classList.add('inactive')

	trendingPreviewSection.classList.add('inactive')
	categoriesPreviewSection.classList.add('inactive')
	genericSection.classList.remove('inactive')
	movieDetailSection.classList.add('inactive')
	likedMoviesSection.classList.add('inactive')

	headerCategoryTitle.innerHTML = 'Tendencias'

	getTrendingMovies()

	infiniteScroll = getPaginatedTrendingMovies
}
