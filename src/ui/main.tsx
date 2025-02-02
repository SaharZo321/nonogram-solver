import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Navigate, RouterProvider, createHashRouter, redirect } from 'react-router-dom'
import ErrorPage from '@routes/ErrorPage.tsx'
import BoardCreation from '@routes/BoardCreation/BoardCreation.tsx'
import BoardSolutions from '@routes/BoardSolutions/BoardSolutions.tsx'

const router = createHashRouter([
	{
		Component: App,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/',
				element: <Navigate to="/board-creation" />,
			},
			{
				path: '/board-creation',
				Component: BoardCreation,

			},
			{
				path: '/board-solutions',
				Component: BoardSolutions,
			},
		]


	}, {
		path: '*',
		action: () => redirect('/board-creation'),
	}

])
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
