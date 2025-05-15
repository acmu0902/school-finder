"use client"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FavoriteButton from "@/app/components/favorite-button"
import { MapPin } from "lucide-react"

interface SchoolDetailTabsProps {
  school?: any
  id: string
}

export default function SchoolDetailTabs({ school, id }: SchoolDetailTabsProps) {
  // Simply use the logo URL if available, or null
  const logoUrl =
    school?.image_url || school?.logo_url || school?.logo || school?.image || school?.photo_url || school?.photo || null

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* School Header - Always visible */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className="relative">
              {logoUrl ? (
                <Image
                  src={logoUrl || "/placeholder.svg"}
                  alt={school?.name || "學校圖片"}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-[#0092D0]/10 rounded-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#0092D0]">{school?.name?.charAt(0) || "S"}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0092D0]">{school?.name || "未命名學校"}</h1>
            <div className="flex items-center mt-2">
              <FavoriteButton schoolId={id} />
              <span className="ml-2 text-sm text-gray-500">收藏此學校</span>
            </div>
            <p className="text-gray-600 mt-2">
              {school?.address ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school?.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 hover:underline flex items-center"
                >
                  <MapPin size={14} className="mr-1 inline-block" />
                  {school?.address}
                </a>
              ) : (
                "未提供地址"
              )}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {school?.district && (
                <span className="px-3 py-1 bg-[#0092D0]/10 text-[#0092D0] rounded-full text-sm">
                  {school?.district}
                </span>
              )}
              {school?.school_type && (
                <span className="px-3 py-1 bg-[#FFAA5A]/10 text-[#FFAA5A] rounded-full text-sm">
                  {school?.school_type}
                </span>
              )}
              {school?.gender && (
                <span className="px-3 py-1 bg-[#FFAA5A]/10 text-[#FFAA5A] rounded-full text-sm">{school?.gender}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 mb-6 bg-[#c3cff7] p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#0092D0] data-[state=active]:text-white">
              基本資料
            </TabsTrigger>
            <TabsTrigger value="facilities" className="data-[state=active]:bg-[#0092D0] data-[state=active]:text-white">
              設施
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="data-[state=active]:bg-[#0092D0] data-[state=active]:text-white">
              課程與理念
            </TabsTrigger>
            <TabsTrigger value="teachers" className="data-[state=active]:bg-[#0092D0] data-[state=active]:text-white">
              教師資料
            </TabsTrigger>
            <TabsTrigger value="additional" className="data-[state=active]:bg-[#0092D0] data-[state=active]:text-white">
              其他資訊
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">聯絡資料</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500">電話</p>
                    <p className="font-medium">{school?.phone || "未提供"}</p>
                  </div>

                  {school?.website && (
                    <div>
                      <p className="text-gray-500">網站</p>
                      <a
                        href={school?.website.startsWith("http") ? school?.website : `https://${school?.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0092D0] hover:underline font-medium"
                      >
                        {school?.website}
                      </a>
                    </div>
                  )}

                  {school?.school_no && (
                    <div>
                      <p className="text-gray-500">學校編號</p>
                      <p className="font-medium">{school?.school_no}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fee Information */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">費用資料</h2>
                <div className="space-y-3">
                  {school?.application_fee !== null && (
                    <div>
                      <p className="text-gray-500">報名費</p>
                      <p className="font-medium">HK$ {school?.application_fee}</p>
                    </div>
                  )}

                  {school?.registration_fee_hd !== null && (
                    <div>
                      <p className="text-gray-500">註冊費 (半日班)</p>
                      <p className="font-medium">HK$ {school?.registration_fee_hd}</p>
                    </div>
                  )}

                  {school?.registration_fee_wd !== null && (
                    <div>
                      <p className="text-gray-500">註冊費 (全日班)</p>
                      <p className="font-medium">HK$ {school?.registration_fee_wd}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {school?.fee_certificate && (
                    <a
                      href={school?.fee_certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-[#0092D0] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#0092D0]/80 focus:outline-none focus:ring-2 focus:ring-[#0092D0] focus:ring-offset-2"
                    >
                      學費資料
                    </a>
                  )}

                  {school?.admissionlink && (
                    <a
                      href={school?.admissionlink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-[#FFAA5A] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#FFAA5A]/80 focus:outline-none focus:ring-2 focus:ring-[#FFAA5A] focus:ring-offset-2"
                    >
                      入學資訊
                    </a>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Indoor Facilities */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">室內設施</h2>
                {school?.indoorplayground ? (
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-[#0092D0]/10 flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-[#0092D0] text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-medium">室內遊樂場</p>
                        <p className="text-sm text-gray-500">{school?.indoorplayground}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">未提供室內設施資料</p>
                )}
              </div>

              {/* Outdoor Facilities */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">戶外設施</h2>
                {school?.outdoorplayground ? (
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-[#0092D0]/10 flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-[#0092D0] text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-medium">戶外遊樂場</p>
                        <p className="text-sm text-gray-500">{school?.outdoorplayground}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">未提供戶外設施資料</p>
                )}
              </div>
            </div>

            {/* Music Room */}
            {school?.musicroom && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">音樂室</h2>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#0092D0]/10 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-[#0092D0] text-xs">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{school?.musicroom}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Special Facilities */}
            {school?.specialrooms && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">特殊設施</h2>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#0092D0]/10 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-[#0092D0] text-xs">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{school?.specialrooms}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-6">
            {/* Teaching Philosophy */}
            {school?.teaching_philosophy && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">教學理念</h2>
                <p className="text-gray-700">{school?.teaching_philosophy}</p>
              </div>
            )}

            {/* Curriculum */}
            {school?.curriculum && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">課程內容</h2>
                <p className="text-gray-700">{school?.curriculum}</p>
              </div>
            )}

            {/* Learning Experience */}
            {school?.learningexperience && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">學習體驗</h2>
                <p className="text-gray-700">{school?.learningexperience}</p>
              </div>
            )}

            {/* Student Support */}
            {school?.studentsupport && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">學生支援</h2>
                <p className="text-gray-700">{school?.studentsupport}</p>
              </div>
            )}

            {/* Collaboration */}
            {school?.collaboration && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">協作與合作</h2>
                <p className="text-gray-700">{school?.collaboration}</p>
              </div>
            )}

            {/* Show message if no curriculum data available */}
            {!school?.teaching_philosophy &&
              !school?.curriculum &&
              !school?.learningexperience &&
              !school?.studentsupport &&
              !school?.collaboration && (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-500">未提供課程與理念相關資料</p>
                </div>
              )}
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-6">
            {/* School Leadership */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-[#0092D0]">學校領導</h2>
              {school?.prin_name || school?.prin_sat ? (
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-16 h-16 rounded-full bg-[#0092D0]/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#0092D0]">{school?.prin_name?.charAt(0) || "校"}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{school?.prin_name || "未提供"}</h3>
                    <p className="text-gray-600">{school?.prin_sat || "校長"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">未提供學校領導資料</p>
              )}
            </div>

            {/* Teacher Statistics */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-[#0092D0]">教師統計</h2>

              {school?.totalprincipalteacher && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2">教職員總數</h3>
                  <p className="text-gray-700">{school?.totalprincipalteacher}</p>
                </div>
              )}

              {/* Teaching Tenure */}
              {(school?.teaching_year_below4 || school?.teaching_year_4_7 || school?.teaching_year_g7) && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-4">教學年資</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {school?.teaching_year_below4 && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-[#0092D0]">4年以下</h4>
                        <p className="text-sm text-gray-600">{school?.teaching_year_below4}</p>
                      </div>
                    )}
                    {school?.teaching_year_4_7 && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-[#0092D0]">4-7年</h4>
                        <p className="text-sm text-gray-600">{school?.teaching_year_4_7}</p>
                      </div>
                    )}
                    {school?.teaching_year_g7 && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-[#0092D0]">7年以上</h4>
                        <p className="text-sm text-gray-600">{school?.teaching_year_g7}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Teacher Qualifications */}
              {(school?.principalandteacher_cece_above ||
                school?.principalteacher_qualified_kgteachers ||
                school?.principalteacher_otherteacher_trainings ||
                school?.principalteacher_qualified_assistantkgteachers) && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">教師資格</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {school?.principalandteacher_cece_above && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-[#0092D0]">持有幼兒教育證書或以上學歷</h4>
                        <p className="text-sm text-gray-600">{school?.principalandteacher_cece_above}</p>
                      </div>
                    )}
                    {school?.principalteacher_qualified_kgteachers && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-[#0092D0]">合格幼稚園教師</h4>
                        <p className="text-sm text-gray-600">{school?.principalteacher_qualified_kgteachers}</p>
                      </div>
                    )}
                    {school?.principalteacher_otherteacher_trainings && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-[#0092D0]">其他教師培訓</h4>
                        <p className="text-sm text-gray-600">{school?.principalteacher_otherteacher_trainings}</p>
                      </div>
                    )}
                    {school?.principalteacher_qualified_assistantkgteachers && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-[#0092D0]">合格助理幼稚園教師</h4>
                        <p className="text-sm text-gray-600">
                          {school?.principalteacher_qualified_assistantkgteachers}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Teacher-Student Ratio */}
            {(school?.tp_ratio_am || school?.tpratiopm || school?.avg_tp_ration) && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">師生比例</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {school?.tp_ratio_am && (
                    <div className="bg-white p-3 rounded shadow-sm text-center">
                      <h3 className="font-semibold text-[#0092D0]">上午班師生比例</h3>
                      <p className="text-lg font-bold text-gray-700">1 : {school?.tp_ratio_am}</p>
                    </div>
                  )}
                  {school?.tpratiopm && (
                    <div className="bg-white p-3 rounded shadow-sm text-center">
                      <h3 className="font-semibold text-[#0092D0]">下午班師生比例</h3>
                      <p className="text-lg font-bold text-gray-700">1: {school?.tpratiopm}</p>
                    </div>
                  )}
                  {school?.avg_tp_ration && (
                    <div className="bg-white p-3 rounded shadow-sm text-center">
                      <h3 className="font-semibold text-[#0092D0]">平均師生比例</h3>
                      <p className="text-lg font-bold text-gray-700">1 : {school?.avg_tp_ration}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Show message if no teacher data available */}
            {!school?.prin_name &&
              !school?.totalprincipalteacher &&
              !school?.teaching_year_below4 &&
              !school?.principalandteacher_cece_above &&
              !school?.tp_ratio_am &&
              !school?.avg_tp_ration && (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-500">未提供教師資料</p>
                </div>
              )}
          </TabsContent>

          {/* Additional Tab */}
          <TabsContent value="additional" className="space-y-6">
            {/* School Hours */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-[#0092D0]">學校時間</h2>
              {school?.school_hours ? (
                <p className="text-gray-700">{school?.school_hours}</p>
              ) : (
                <p className="text-gray-500">未提供學校時間資料</p>
              )}
            </div>

            {/* Uniform and Supplies */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-[#0092D0]">校服及用品</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Uniform Costs */}
                <div>
                  <h3 className="font-semibold text-[#0092D0] mb-2">校服費用</h3>
                  <div className="space-y-2">
                    {school?.summer_uniform_cost ? (
                      <div className="flex justify-between">
                        <span className="text-gray-600">夏季校服:</span>
                        <span className="font-medium">HK$ {school?.summer_uniform_cost}</span>
                      </div>
                    ) : null}

                    {school?.winter_uniform_cost ? (
                      <div className="flex justify-between">
                        <span className="text-gray-600">冬季校服:</span>
                        <span className="font-medium">HK$ {school?.winter_uniform_cost}</span>
                      </div>
                    ) : null}

                    {school?.schoolbag ? (
                      <div className="flex justify-between">
                        <span className="text-gray-600">書包:</span>
                        <span className="font-medium">{school?.schoolbag}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Other Supplies */}
                <div>
                  <h3 className="font-semibold text-[#0092D0] mb-2">其他用品</h3>
                  <div className="space-y-2">
                    {school?.textbooks ? (
                      <div>
                        <span className="text-gray-600">教科書:</span>
                        <p className="font-medium mt-1">{school?.textbooks}</p>
                      </div>
                    ) : null}

                    {school?.tea ? (
                      <div>
                        <span className="text-gray-600">茶點:</span>
                        <p className="font-medium mt-1">{school?.tea}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {!school?.summer_uniform_cost &&
                !school?.winter_uniform_cost &&
                !school?.schoolbag &&
                !school?.textbooks &&
                !school?.tea && <p className="text-gray-500 text-center">未提供校服及用品資料</p>}
            </div>

            {/* Vision */}
            {school?.vision && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-[#0092D0]">學校願景</h2>
                <p className="text-gray-700">{school?.vision}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
