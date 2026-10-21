import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {LoadingStatus} from "./LoadingStatus";
import {StoryGame} from "./StoryGame";

import { api } from "../api/client";
import type { Story } from "../api/types";

export function StoryLoader() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        async function loadStory (storyId: string)  {
            setLoading(true);
            setError("");

            try {
                const { data, error, response} = await api.GET(
                    '/story/{story_id}/complete',
                    {
                        params: {
                            path: { story_id: Number(storyId)}
                        }
                    }
                );
                if (error) {
                    setError(response.status === 404 ? "Story not found." : "Failed to load story");
                    return;
                }
                setStory(data);
            } catch (err) {
                console.error("An unexpected error occurred", err);
            } finally {
                setLoading(false);
            }
        }

        void loadStory(id);
    }, [id]);

    const createNewStory = () => {
        navigate("/");
    }

    if (loading) {
        return <LoadingStatus theme={"story"}/>
    }

    if (error) {
        return <div className="story-loader">
            <div className="error-message">
                <h2>Story Not Found</h2>
                <p>{error}</p>
                <button onClick={createNewStory}>Go to Story Generator</button>
            </div>
        </div>
    }

    if (story) {
        return <div className="story-loader">
            <StoryGame story={story} onNewStory={createNewStory}/>
        </div>
    }
}