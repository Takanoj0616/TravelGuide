import React from 'react';
import { useParams } from 'react-router-dom';
import { modelCourses } from '../data/modelCourses';
import { MapPin, Clock } from 'lucide-react';

export const ModelCourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = modelCourses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">コースが見つかりません</h1>
        <p className="text-gray-500 mt-2">
          お探しのモデルコースは存在しないか、削除された可能性があります。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-12 bg-gray-50 rounded-lg px-8 my-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {course.title}
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl">
              {course.summary}
            </p>
            <div className="mt-6 flex items-center gap-x-6 text-sm font-medium">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{course.area}</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{course.theme}</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">{course.duration}</span>
            </div>
        </div>

        {/* Itinerary Timeline */}
        <div className="mt-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">タイムライン</h2>
          <div className="relative">
            {/* The vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>

            {course.itinerary.map((spot, index) => (
              <div key={index} className="relative mb-12">
                <div className="flex items-center">
                  {/* Time and Content on alternating sides */}
                  <div className={`w-1/2 pr-8 text-right ${index % 2 !== 0 && 'order-2'}`}>
                    <p className="text-lg font-bold text-blue-600">{spot.time}</p>
                  </div>
                  <div className={`w-1/2 pl-8 ${index % 2 !== 0 && 'text-right'}`}></div>
                </div>

                {/* The circle on the timeline */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white"></div>
                
                {/* Content Card */}
                <div className={`mt-4 mx-auto w-full md:w-2/3 lg:w-1/2`}>
                   <div className="bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <img src={spot.imageUrl} alt={spot.spotName} className="w-full h-48 object-cover" />
                    <div className="p-6">
                        <h3 className="text-2xl font-bold mb-2">{spot.spotName}</h3>
                        <p className="text-gray-600">{spot.description}</p>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1.5" />
                            <span>{spot.location.lat}, {spot.location.lng}</span>
                        </div>
                    </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 