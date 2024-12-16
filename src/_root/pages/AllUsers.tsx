import Loader from '@/components/shared/Loader'
import UserCard from '@/components/shared/UserCard'
import { useToast } from '@/hooks/use-toast'
import { useGetUsers, useGetUserById, useFollowingUser } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const AllUsers = () => {
    const { toast } = useToast()
    const { user } = useUserContext()
    
    const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers()
    const { data: currentUser } = useGetUserById(user.id)

    const { mutate: followUser } = useFollowingUser()

    const handleFollow = (targetUserId: string) => {
        let newFollowing = [...(currentUser?.following || [])]

        const isFollowing = currentUser?.following.includes(targetUserId)

        if (isFollowing) {
            newFollowing = newFollowing.filter((id) => id !== targetUserId)
        } else {
            newFollowing.push(targetUserId)
        }

        followUser({
            userId: user.id,
            followingArray: newFollowing,
            targetUserId: targetUserId
        })
    }

    if (isErrorCreators) {
        toast({ title: 'Something went wrong.' })
        return
    }

    const filteredCreators = creators?.documents.filter((creator) => creator.$id !== user.id)

    return (
        <div className="common-container">
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
                {isLoading && !creators ? (
                    <Loader />
                ) : (
                    <ul className="user-grid">
                        {filteredCreators?.map((creator) => {
                            const isFollowing = currentUser?.following.includes(creator.$id)

                            return (
                                <li key={creator?.$id} className="flex-1 min-w-[200px] w-full">
                                    <UserCard 
                                        user={creator} 
                                        isFollowing={isFollowing}
                                        onFollow={() => handleFollow(creator.$id)}
                                    />
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default AllUsers
