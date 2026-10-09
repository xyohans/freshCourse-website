require('dotenv').config()
const { createClient } = require("@supabase/supabase-js")


const BASE_URL = 'https://vxfdjwvrecopnmkhijvf.supabase.co/storage/v1/object/public/courses/contents/'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updateContentUrls() {
  // get all subtopics with their chapter and course info
  const { data: subtopics, error } = await supabase
    .from('subtopics')
    .select(`
      id,
      title,
      chapter_id,
      chapters (
        chapter_number,
        course_id,
        courses ( route_key )
      )
    `)

  if (error) {
    console.error('Error fetching subtopics:', error)
    return
  }

  for (const subtopic of subtopics) {
    const courseKey = subtopic.chapters.courses.route_key
    const chapterNumber = subtopic.chapters.chapter_number

    // convert title to filename
    const filename = subtopic.title
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '') // remove special chars
      .replace(/\s+/g, '_')            // spaces to underscores

    const url = `${BASE_URL}/${courseKey}/chapter${chapterNumber}/${filename}.md`

    const { error: updateError } = await supabase
      .from('subtopics')
      .update({ content_url: url })
      .eq('id', subtopic.id)

    if (updateError) {
      console.error(`Failed to update subtopic ${subtopic.id}:`, updateError)
    } else {
      console.log(`Updated: ${courseKey}/chapter${chapterNumber}/${filename}.md`)
    }
  }

  console.log('Done!')
}

updateContentUrls()