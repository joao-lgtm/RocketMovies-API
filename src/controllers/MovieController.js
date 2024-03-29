const knex = require("../database/knex")

class MovieController {
    async create(request, response) {
        const { title, description, tags, rating } = request.body;
       const  user_id  = request.user.id;

        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        });

        const movieTagsInsert = tags.map(name => {
            return {
                note_id,
                user_id,
                name
            }
        })

        await knex("movie_tags").insert(movieTagsInsert);

        response.json()
    }

    async show(request, response) {
        const { id } = request.params;

        const movie = await knex("movie_notes").where({ id }).first();
        const tags = await knex("movie_tags").where({ note_id: id }).orderBy("name");
        

        return response.json({ ...movie, tags })
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("movie_notes").where({ id }).delete();

        return response.json()
    }

    async index(request, response) {
        const {  title, name } = request.query;
        const  user_id  = request.user.id;

        

        let notes;

        if (name) {
            const filterTags = name.split(',').map(name => name.trim());
            notes = await knex("movie_tags")
                .select([
                    "movie_notes.id",
                    "movie_notes.title",
                    "movie_notes.user_id",
                ])
                .where("movie_notes.user_id", user_id)
                .whereLike("movie_notes.title", `%${title}%`)
                .whereIn("name", filterTags)
                .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
                .orderBy("movie_notes.title")

        } else {
            notes = await knex("movie_notes")
                // .where({ user_id })
                .whereLike("title", `%${title}%`)
                .orderBy("title");
        }

        const userTags = await knex("movie_tags")
        const notesWithTags = notes.map(note => {
            const notesTags = userTags.filter(tag => tag.note_id === note.id);

            return {
                ...note,
                tags: notesTags
            }
        });

        return response.json(notesWithTags)

    }
}

module.exports = MovieController;