import React from 'react';
import { Link } from 'react-router-dom';
import { modelCourses } from '../data/modelCourses';

export const ModelCourseListPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            テーマ別モデルコース
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            専門家が厳選した、最高の旅行プランを見つけよう。
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modelCourses.map((course) => (
            <Link 
              key={course.id} 
              to={`/model-courses/${course.id}`}
              className="group block"
            >
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <img
                  className="lg:h-48 md:h-36 w-full object-cover object-center"
                  src={course.thumbnailUrl}
                  alt={course.title}
                />
                <div className="p-6 bg-white">
                  <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1 uppercase">
                    {course.area} &middot; {course.theme}
                  </h2>
                  <h1 className="title-font text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h1>
                  <p className="leading-relaxed mb-3 text-gray-600">
                    {course.summary}
                  </p>
                  <div className="flex items-center flex-wrap ">
                    <span className="text-blue-600 inline-flex items-center md:mb-2 lg:mb-0">
                      詳細を見る
                      <svg
                        className="w-4 h-4 ml-2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </span>
                    <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                      {course.duration}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}; 