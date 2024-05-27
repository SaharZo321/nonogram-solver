import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Navigate, RouterProvider, createHashRouter } from 'react-router-dom'
import ErrorPage from 'Components/Routes/ErrorPage/ErrorPage.tsx'
import HomePage from 'Components/Routes/HomePage/HomePage.tsx'
import BoardCreation from 'Components/Routes/AISolver/BoardCreation/BoardCreation.tsx'
import BoardSolutions from 'Components/Routes/AISolver/BoardSolutions/BoardSolutions.tsx'

const router = createHashRouter([
	{
		Component: App,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/',
				Component: HomePage
			},
			{
				path: '/ai-solver/',
				children: [
					{
						path: 'board-creation',
						Component: BoardCreation,
					},
					{
						path: 'board-solutions',
						Component: BoardSolutions,
					},
				]
			},
		]
	}, {
		path: '*',
		element: (<Navigate to='/' replace />),
	}

])
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
	console.log(message)
})
