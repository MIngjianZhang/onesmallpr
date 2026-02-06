import { Router, type Request, type Response } from 'express'
import { userStore } from '../db/users.js'

const router = Router()

/**
 * Mock Login / Register
 * In a real app, this would handle OAuth callbacks.
 * For now, we simulate a login that returns a user ID.
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  // Receive user details from frontend to keep IDs in sync
  const { id, email, name } = req.body;

  const mockUser = {
    id: id || 'user-' + Date.now(),
    username: name || 'new_contributor',
    email: email || 'user@example.com',
    avatarUrl: 'https://github.com/ghost.png'
  };
  
  // Create or update user in store
  userStore.createUser(mockUser);

  res.json({
    success: true,
    user: mockUser,
    token: 'mock-jwt-token-' + mockUser.id
  })
})

/**
 * Update User Profile (Onboarding)
 */
router.post('/onboarding', async (req: Request, res: Response): Promise<void> => {
  const { userId, data } = req.body;
  
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const updatedUser = userStore.updateUser(userId, data);
  
  if (!updatedUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    success: true,
    user: updatedUser
  })
})

/**
 * Get Current User Profile
 */
router.get('/me', async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId as string; // Simple mock auth
    const user = userStore.getUser(userId);
    if(user) {
        res.json({ user });
    } else {
        res.status(404).json({ error: "User not found" });
    }
})

export default router
